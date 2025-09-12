const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

exports.submitContactForm = async (req, res) => {
  const { email, phone, firstName, lastName, reason, comment } = req.body;
  const fullName = `${firstName} ${lastName}`;

  // 🛠️ Log to verify values
  console.log('Sending email to:', process.env.EMAIL_TO);

  if (!process.env.EMAIL_TO) {
    return res.status(500).json({
      success: false,
      message: 'Admin email (EMAIL_TO) not defined in .env file',
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,  // sender = admin
    to: process.env.EMAIL_TO,                                    // recipient = admin
    subject: `📩 New Contact Form Submission from ${fullName}`,
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email (User's):</strong> ${email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Reason:</strong> ${reason || 'Not provided'}</p>
      <p><strong>Comment:</strong> ${comment || 'Not provided'}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully to admin' });
  } catch (error) {
    console.error('❌ Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};
