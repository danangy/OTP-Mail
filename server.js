const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

let otp;
let userEmail;





app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public');
});


app.post('/send-otp', (req, res) => {
  userEmail = req.body.email;
  otp = Math.floor(100000 + Math.random() * 900000); 

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '', 
      pass: '',  
    },
  });

  let mailOptions = {
    from: 'lukanlasitah@gmail.com',
    to: userEmail,
    subject: 'Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; max-width: 600px; margin: auto; border-radius: 10px;">
        <h2 style="text-align: center; color: #333;">Your One-Time Password (OTP)</h2>
        <p style="font-size: 16px; color: #555;">
          Hello, <br><br>
          Thank you for logging in. Use the OTP code below to complete your login process:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #1a73e8; padding: 10px 20px; background-color: #fff; border: 2px solid #1a73e8; border-radius: 5px; display: inline-block;">${otp}</span>
        </div>
        <p style="font-size: 16px; color: #555;">
          The OTP is valid for the next 10 minutes. If you did not request this OTP, please ignore this email.
        </p>
        <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
        <footer style="text-align: center; font-size: 14px; color: #777;">
          <p>&copy; 2024 Your Company. All Rights Reserved.</p>
        </footer>
      </div>
    `,
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });

  res.redirect('/verify-otp');
});

app.get('/verify-otp', (req, res) => {
  res.sendFile(__dirname + '/public/verify-otp.html');
});

app.post('/verify-otp', (req, res) => {
  let inputOtp = req.body.otp;
  if (inputOtp == otp) {
    res.send('OTP verified successfully!');
  } else {
    res.send('Invalid OTP, please try again.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
