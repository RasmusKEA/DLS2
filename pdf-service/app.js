/* eslint-disable import/extensions */
import express from 'express';
import pkg from 'body-parser';
import cors from 'cors';
import { launch } from 'puppeteer';
import fs from 'fs';
import { uploadFile } from './aws.js';
import config from './config/index.js';

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging
  res.status(500).json({ error: 'Internal Server Error' });
};

const { urlencoded, json } = pkg;

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json({ limit: '50mb' }));

app.get('/', async (req, res) => {
  res.end('root');
});

app.post('/convert', async (req, res, next) => {
  try {
    const { returnType, fileName, content } = req.body;
    if (returnType !== 'link') {
      throw new Error('Unrecognized return type. Can only be "link"');
    }

    const browser = await launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true, // Use headless mode
    });

    // Create a new page
    const page = await browser.newPage();

    // Set the HTML content for the page
    await page.setContent(content, { waitUntil: 'domcontentloaded' });

    // Emulate media type to reflect CSS used for screens
    await page.emulateMediaType('screen');

    // Generate the PDF
    const pdf = await page.pdf({
      path: fileName,
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

    const out = {};
    const buff = fs.readFileSync(fileName);
    const upload = await uploadFile(buff, fileName);
    out.link = upload;

    // Delete the temporary file
    fs.unlinkSync(fileName);

    await browser.close();

    return res.json(out);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));