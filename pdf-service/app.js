/* eslint-disable import/extensions */
import express from "express";
import pkg from "body-parser";
import cors from "cors";
import { launch } from "puppeteer";
import fs from "fs";
import { uploadFile } from "./aws.js";
import config from "./config/index.js";

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


app.post("/convert", async (req, res, next) => {
  try {
    const { returnType, fileName, content } = req.body;
    if (returnType !== "link") {
      throw new Error("unrecoqnized return type. Can only be base64 or link");
    }
   
    const browser = await launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });

    // Create page
    const page = await browser.newPage();

    // Get HTML content from HTML file
    await page.setContent(content, { waitUntil: "domcontentloaded" });

    // To reflect CSS used for screens
    await page.emulateMediaType("screen");

    
    const pdf = await page.pdf({
      path: fileName,
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    });

    const out = {};
    const buff = fs.readFileSync(fileName);
    const upload = await uploadFile(buff, fileName);
    out.link = upload;

  
    fs.unlink(`${process.cwd()}/${fileName}`, (err) => {
      if (err) {
        throw err;
      }
    });

  
    await browser.close();

    return res.json(out);
  } catch (error) {
    return next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));
