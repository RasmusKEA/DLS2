const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const elasticClient = require("./elastic-client");
require("dotenv").config({ path: ".okta.env" });
require("express-async-errors");
const jwt = require("jsonwebtoken");
const template = require("./pdf-templates/template.js");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const OKTA_ORG_URL = "https://dev-42985177.okta.com";
const OKTA_API_TOKEN = "00_EUjycaGe20uQmAgHP8mV1OO0Gkt-boQFeClJ68t";

const securedRouter = express.Router();


app.post("/create-user", async (req, res) => {
  console.log(req.body);
  const { username, password, email, firstName, lastName } = req.body;
  try {
    const response = await axios.post(
      `${OKTA_ORG_URL}/api/v1/users`,
      {
        profile: {
          login: username,
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
        credentials: {
          password: {
            value: password,
          },
        },
      },
      {
        headers: {
          Authorization: `SSWS ${OKTA_API_TOKEN}`, // Corrected line
          "Content-Type": "application/json",
        },
      }
    );

    let profile = {
      idOkta: response.data.id,
      login: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
    };
    console.log(response.status);

    if (response.status === 200) {
      // Assuming you have an instance of the ElasticSearch client named elasticClient
      await elasticClient
        .index({
          index: "users",
          body: profile,
        })
        .then((response) => {
          console.log(response);
        });

      // Call the send-mail endpoint
      const sendMailResponse = await axios.post(
        "http://localhost:6001/send-mail",
        {
          to: email,
          subject: "Your Login Credentials",
          email: email,
          password: password,
        }
      );

      console.log(sendMailResponse.data);
    }

    res.status(201).json({
      message: "User created successfully",
      data: response.data,
    });
  } catch (error) {
    const errorMessage = error.response.data.errorCauses[0].errorSummary;
    res.status(400).json({ message: "Failed to create user", error: errorMessage });
  }
});

app.delete("/remove-user", async (req, res) => {
  const { userIds, oktaIds } = req.body;
  console.log(req.body);
  try {
    const deletePromises = userIds.map(async (id) => {
      try {
        await elasticClient.delete({
          index: "users",
          id: id,
        });
      } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw new Error(`Failed to delete user with ID ${id}`);
      }
    });

    await Promise.all(deletePromises);

    // Delete users from Okta organization
    const oktaDeletePromises = oktaIds.map(async (oktaId) => {
      try {
        const response = await axios.delete(
          `${OKTA_ORG_URL}/api/v1/users/${oktaId}`,
          {
            headers: {
              Authorization: `SSWS ${OKTA_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status !== 204) {
          console.error(
            `Error deleting user with Okta ID ${oktaId}:`,
            response.statusText
          );
          throw new Error(`Failed to delete user with Okta ID ${oktaId}`);
        }
      } catch (error) {
        console.error(`Error deleting user with Okta ID ${oktaId}:`, error);
        throw new Error(`Failed to delete user with Okta ID ${oktaId}`);
      }
    });

    await Promise.all(oktaDeletePromises);

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

app.get("/search", async (req, res) => {
  const result = await elasticClient.search({
    index: "users",
    query: { fuzzy: { email: req.query.query } },
  });

  res.json(result);
});
app.get("/users", async (req, res) => {
  const result = await elasticClient.search({
    index: "users",
    size: 100,
    query: { match_all: {} },
  });

  res.send(result);
});

// Route to generate a JWT token
app.post("/auth", (req, res) => {
  let secretKey = "";
  let roles = [];
  let redirectUrl = "";
  if (req.body.sub === "00u9jvsfuvFVNJKLn5d7") {
    secretKey = "rasmus-secret";
    redirectUrl = "http://localhost:3001";
    roles = ["customer", "admin"];
  } else {
    secretKey = "rasmus-secret";
    redirectUrl = "http://localhost:3002";
    roles = ["customer"];
  }

  const payload = { sub: req.body.sub, roles };

  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  res.json({ token, redirectUrl, roles });
});

app.post("/verify-auth", (req, res) => {
  const { token, secret, roles } = req.body;

  if (secret !== "rasmus-secret") {
    return res.json({ valid: false });
  }

  try {
    jwt.verify(token, "rasmus-secret");
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
});

app.post("/verify-auth-customer", (req, res) => {
  const { token, secret } = req.body;

  if (secret !== "customer") {
    return res.json({ valid: false });
  }

  try {
    jwt.verify(token, "customer");
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
});

app.post("/convertPDF", async (req, res) => {
  const { content } = req.body;
  const fileName = uuidv4();

  const totalPrice = content.reduce((accumulator, item) => {
    const price = parseFloat(item.price); // Convert price to a number
    if (!isNaN(price)) {
      return accumulator + price;
    } else {
      return accumulator;
    }
  }, 0);

  let pdf = template(content, totalPrice);

  try {
    const response = await axios.post(
      "http://localhost:5001/convert",
      {
        returnType: "link",
        fileName: `${fileName}.pdf`,
        content: pdf,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the response from the /convert endpoint
    console.log(response.data);
    res.send(response.data); // or any other response data
  } catch (error) {
    // Handle the error appropriately
    console.error("Error:", error);
    res.status(500).send("PDF conversion request failed"); // or any other error response
  }
});

app.use(securedRouter);
app.listen(8080);
