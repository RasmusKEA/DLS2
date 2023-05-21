const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mysql = require("mysql");
const cors = require("cors");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "password",
  database: "invoices",
});

// Define the GraphQL schema
const schema = buildSchema(`
  type Invoice {
    id: ID!
    email: String!
    link: String!
  }

  type Query {
    getInvoice(id: ID!): Invoice
    getInvoiceByEmail(email: String!): [String]
    getAllInvoices: [Invoice]
  }

  type Mutation {
    createInvoice(email: String!, link: String!): Invoice
    updateInvoice(id: ID!, email: String!, link: String!): Invoice
    deleteInvoice(id: ID!): Invoice
  }
`);

// Define the root resolvers
const root = {
  getInvoice: (args) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM invoices WHERE id = ?",
        [args.id],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0]);
        }
      );
    });
  },
  getInvoiceByEmail: (args) => {
    const { email } = args;
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT link FROM invoices WHERE email = ?",
        [email],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    }).then((results) => {
      // Extract and return the 'link' values from the results
      return results.map((result) => result.link);
    });
  },
  getAllInvoices: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM invoices", (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  },
  createInvoice: (args) => {
    const { email, link } = args;
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO invoices (email, link) VALUES (?, ?)",
        [email, link],
        (error, results) => {
          if (error) reject(error);
          if (results && results.insertId) {
            resolve({
              id: results.insertId,
              email,
              link,
            });
          } else {
            reject(new Error("Failed to create invoice"));
          }
        }
      );
    });
  },
  updateInvoice: (args) => {
    const { id, email, link } = args;
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE invoices SET email = ?, link = ? WHERE id = ?",
        [email, link, id],
        (error) => {
          if (error) reject(error);
          resolve({
            id,
            email,
            link,
          });
        }
      );
    });
  },
  deleteInvoice: (args) => {
    const { id } = args;
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM invoices WHERE id = ?", [id], (error) => {
        if (error) reject(error);
        resolve({
          id,
          email: null,
          link: null,
        });
      });
    });
  },
};

// Create an Express server
const app = express();
app.use(cors());
// Define the GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start the server
app.listen(8001, () => {
  console.log("Server is listening on port 8001");
});
