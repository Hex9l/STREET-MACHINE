import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Define nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // You can change this to another provider if needed
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

router.post('/', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required fields.' });
    }

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({ 
                message: 'Server Configuration Error: EMAIL_USER or EMAIL_PASS is missing or empty in the .env file.' 
            });
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address (needs to match auth user for Gmail)
            to: 'henilpatel200425@gmail.com', // Target email
            subject: `New Contact Form Submission from ${name}`,
            text: `You have a new message from the Street Machine Contact Form:
        
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
`,
            html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        `
        };

        // Send email asynchronously in the background so the user doesn't wait
        transporter.sendMail(mailOptions)
            .then(info => console.log('Message sent: %s', info.messageId))
            .catch(error => console.error('Error sending background email:', error));

        return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error handling contact form:', error);

        return res.status(500).json({ message: 'Failed to process message. Please try again later.' });
    }
});

export default router;
