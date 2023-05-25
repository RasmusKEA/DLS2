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
const { setupRabbitMQ, queueName, exchangeName } = require("./rabbitmq");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PDF Invoice API",
      version: "1.0.0",
      description: "API documentation PDF Invoice",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Local server",
      },
    ],
  },
  apis: ["app.js"], // Replace with the actual path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(bodyParser.json());
app.use(cors());

const OKTA_ORG_URL = "https://dev-42985177.okta.com";
const OKTA_API_TOKEN = "00_EUjycaGe20uQmAgHP8mV1OO0Gkt-boQFeClJ68t";

const securedRouter = express.Router();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /create-user:
 *   post:
 *     summary: Create a new user
 *     description: This endpoint allows you to create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user.
 *               password:
 *                 type: string
 *                 description: The password of the new user.
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *               firstName:
 *                 type: string
 *                 description: The first name of the new user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the new user.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 data:
 *                   type: object
 *                   description: Additional data about the created user.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the created user.
 *       400:
 *         description: Failed to create user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                 error:
 *                   type: string
 *                   description: The error description.
 */
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
    res
      .status(400)
      .json({ message: "Failed to create user", error: errorMessage });
  }
});

/**
 * @swagger
 * /remove-user:
 *   delete:
 *     summary: Remove users
 *     description: This endpoint allows you to remove users from the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of user IDs to remove.
 *               oktaIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of Okta user IDs to remove.
 *     responses:
 *       200:
 *         description: Users removed successfully
 *       400:
 *         description: Failed to remove users
 */
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

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search users
 *     description: This endpoint allows you to search users based on their email using Elasticsearch.
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The email to search for.
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 took:
 *                   type: number
 *                   description: The time in milliseconds taken for the search operation.
 *                 timed_out:
 *                   type: boolean
 *                   description: Indicates if the search operation timed out.
 *                 _shards:
 *                   type: object
 *                   description: Information about the shards involved in the search operation.
 *                 hits:
 *                   type: object
 *                   description: The search hits containing the matching documents.
 *       400:
 *         description: Failed to retrieve search results
 */
app.get("/search", async (req, res) => {
  const result = await elasticClient.search({
    index: "users",
    query: { fuzzy: { email: req.query.query } },
  });

  res.json(result);
});
/**
 * Get all users.
 *
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users from Elasticsearch.
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       400:
 *         description: Failed to retrieve users.
 */

app.get("/users", async (req, res) => {
  const result = await elasticClient.search({
    index: "users",
    size: 100,
    query: { match_all: {} },
  });

  res.send(result);
});

/**
 * Authenticate user and generate token.
 *
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticate user and generate token
 *     description: Authenticate the user and generate a JWT token for authorization purposes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sub:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful. Token and redirect URL returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authorization.
 *                 redirectUrl:
 *                   type: string
 *                   description: Redirect URL after successful authentication.
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: User roles associated with the token.
 *       400:
 *         description: Authentication failed.
 */

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

/**
 * Verify authentication token.
 *
 * @swagger
 * /verify-auth:
 *   post:
 *     summary: Verify authentication token
 *     description: Verify the authenticity and validity of a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token to verify.
 *               secret:
 *                 type: string
 *                 description: Secret key used to sign the token.
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: User roles associated with the token.
 *     responses:
 *       200:
 *         description: Token is valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Indicates whether the token is valid or not.
 *       400:
 *         description: Token is invalid or authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Indicates whether the token is valid or not.
 */

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

/**
 * Convert content to PDF and send it for processing.
 *
 * @swagger
 * /convertPDF:
 *   post:
 *     summary: Convert content to PDF
 *     description: Convert the provided content to a PDF file and send it for processing.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                 description: The content to be converted to a PDF.
 *               email:
 *                 type: string
 *                 description: The email address to send the PDF link to.
 *     responses:
 *       200:
 *         description: PDF conversion request successful.
 *       500:
 *         description: PDF conversion request failed.
 */
app.post("/convertPDF", async (req, res) => {
  const { content, email } = req.body;
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
    // Set up RabbitMQ connection and channel
    const { connection, channel } = await setupRabbitMQ();

    // Ensure that the queue exists, otherwise create it
    await channel.assertQueue(queueName, { durable: true });

    const message = {
      returnType: "link",
      fileName: `${fileName}.pdf`,
      content: pdf,
      email: email,
    };

    // Publish the message to RabbitMQ
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    axios
      .post("http://localhost:8001/graphql", {
        query: `
      mutation {
        createInvoice(email: "${email}", link: "${
          "https://rr-pdf-bucket.s3.amazonaws.com/" + fileName + ".pdf"
        }") {
          email
          link
        }
      }
    `,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });

    // Handle the response from the /convert endpoint
    console.log("Message published to RabbitMQ");
    res.status(200).end(); // or any other success response
  } catch (error) {
    // Handle the error appropriately
    console.error("Error:", error);
    res.status(500).send("PDF conversion request failed"); // or any other error response
  }
});

app.use(securedRouter);
app.listen(8080, () => console.log(`Listening on port ${8080}`));
