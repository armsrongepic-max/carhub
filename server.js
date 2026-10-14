require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});


let emailQueue = [];


app.post('/api/send-notification', async (req, res) => {
  const { to, subject, message, type } = req.body;

  try {
   
    const emailData = {
      id: Date.now(),
      to,
      subject,
      message,
      type,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    emailQueue.push(emailData);

    // In production, uncomment this to send real emails:
  
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message
    });
    

    console.log('Email notification queued:', emailData);
    res.json({ success: true, message: 'Email notification sent successfully' });

  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send email notification' });
  }
});


app.get('/api/email-queue', (req, res) => {
  res.json(emailQueue);
});


app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
   
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'admin@carhub.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Carhub',
      html: `
        <h3>Thank you for reaching out!</h3>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you soon.</p>
        <p>Your message: ${message}</p>
        <br>
        <p>Best regards,<br>Carhub Team</p>
      `
    });

    res.json({ success: true, message: 'Contact form submitted successfully' });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Failed to send contact form' });
  }
});


app.post('/api/car-inquiry', async (req, res) => {
  const { carId, buyerName, buyerEmail, sellerEmail, sellerPhone, carDetails } = req.body;

  try {
  
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sellerEmail,
      subject: `New inquiry for your ${carDetails.brand} ${carDetails.model}`,
      html: `
        <h3>New Car Inquiry</h3>
        <p><strong>Buyer:</strong> ${buyerName} (${buyerEmail})</p>
        <p><strong>Car:</strong> ${carDetails.brand} ${carDetails.model} (${carDetails.year})</p>
        <p><strong>Price:</strong> ₦${carDetails.price.toLocaleString()}</p>
        <p><strong>Location:</strong> ${carDetails.location}</p>
        <br>
        <p>Please contact the buyer at: ${buyerEmail}</p>
        <p>Or call them directly to discuss the details.</p>
      `
    });

   
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: buyerEmail,
      subject: `Inquiry sent for ${carDetails.brand} ${carDetails.model}`,
      html: `
        <h3>Inquiry Sent Successfully</h3>
        <p>Hi ${buyerName},</p>
        <p>Your inquiry for the ${carDetails.brand} ${carDetails.model} has been sent to the seller.</p>
        <p><strong>Seller Contact:</strong> ${sellerEmail}</p>
        ${sellerPhone ? `<p><strong>Seller Phone:</strong> ${sellerPhone}</p>` : ''}
        <p>The seller will contact you soon via email or phone.</p>
        <br>
        <p>Best regards,<br>Carhub Team</p>
      `
    });

    res.json({ success: true, message: 'Car inquiry notification sent' });

  } catch (error) {
    console.error('Car inquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to send car inquiry' });
  }
});


app.listen(PORT, () => {
  console.log(`Email notification server running on port ${PORT}`);
});