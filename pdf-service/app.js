/* eslint-disable import/extensions */
import express from "express";
import pkg from "body-parser";
import cors from "cors";
import { launch } from "puppeteer";
import fs from "fs";
import { uploadFile } from "./aws.js";
import config from "./config/index.js";
import { setupRabbitMQ, queueName } from "./rabbitmq.js";

const errorHandler = async (err, req, res, next) => {
  res.status(500).json(err);
};

// extract json
const { urlencoded, json } = pkg;

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json({ limit: "50mb" }));

app.get("/", async (req, res, next) => {
  return res.end("root");
});

async function processMessage(message) {
  try {
    const { content } = message;

    // Process the message data as needed
    const {
      returnType,
      fileName,
      footer,
      header,
      content: htmlContent,
      mergePdf,
    } = JSON.parse(content.toString());

    const browser = await launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Create a new page
    const page = await browser.newPage();

    // Get HTML content from HTML file
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // Download the PDF
    const pdf = await page.pdf({
      path: fileName,
      margin: {
        top: "100px",
        right: "50px",
        bottom: "100px",
        left: "50px",
      },
      printBackground: true,
      format: "A4",
      displayHeaderFooter: !!(footer || header),
      headerTemplate: header,
      footerTemplate: footer,
    });

    console.log("PDF generated:", fileName);

    // Close the browser instance
    await browser.close();

    const out = {};
    if (returnType === "link") {
      const buff = fs.readFileSync(fileName);
      const upload = await uploadFile(buff, fileName);
      out.link = upload;
    } else if (returnType === "base64") {
      out.base64 = pdf.toString("base64");
    }

    fs.unlink(`${process.cwd()}/${fileName}`, (err) => {
      if (err) {
        throw err;
      }
    });

    console.log("PDF processing completed:", fileName);
  } catch (error) {
    console.error("Error processing message:", error);
  }
}

async function startMessageConsumer() {
  try {
    const { connection, channel } = await setupRabbitMQ();

    // Consume messages from the queue
    channel.consume(queueName, async (message) => {
      if (message) {
        await processMessage(message);
        channel.ack(message); // Acknowledge the message to remove it from the queue
      }
    });
  } catch (error) {
    console.error("Failed to set up RabbitMQ:", error);
    process.exit(1);
  }
}

startMessageConsumer();

app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));
