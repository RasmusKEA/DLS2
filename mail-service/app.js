const express = require('express');
const nodemailer = require('nodemailer');
const cors = require("cors");

const app = express();
app.use(cors());


// Middleware to parse JSON data
app.use(express.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'rasmustrap97@gmail.com',
    pass: 'kqbcruqooftdwncp',
  },
});

// Define the endpoint
app.post('/send-mail', (req, res) => {
  const { to, subject, email, password } = req.body;

  const mailOptions = {
    from: 'rasmustrap97@gmail.com',
    to,
    subject,
    text: `Hello, your user is now created with this email: ${email} and this password: ${password}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(6001, () => {
  console.log('Server is running on port 6001');
});