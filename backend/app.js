const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = 7001;

// Okta API configuration
const OKTA_ORG_URL = "https://dev-42985177.okta.com";
const OKTA_API_TOKEN = "00_EUjycaGe20uQmAgHP8mV1OO0Gkt-boQFeClJ68t";

app.use(bodyParser.json());

// Create user route
app.post("/users", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const response = await axios.post(
      `${OKTA_ORG_URL}/api/v1/users`,
      {
        profile: {
          login: username,
          email: email,
          firstName: "John",
          lastName: "Doe",
        },
        credentials: {
          password: {
            value: password,
          },
        },
      },
      {
        headers: {
          Authorization: `SSWS ${OKTA_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res
      .status(201)
      .json({ message: "User created successfully", data: response.data });
  } catch (error) {
    const errorMessage = error.response.data.errorCauses[0].errorSummary;
    res
      .status(400)
      .json({ message: "Failed to create user", error: errorMessage });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
