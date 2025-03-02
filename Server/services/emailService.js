import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendWelcomeEmail(recipient) {
    try {
        await transporter.sendMail({
            from: `Our Voice Team <${process.env.EMAIL_USER}>`,
            to: recipient,
            subject: `Welcome to Our Voice!`,
            html: `
                <h1>Welcome to CitizenConnect360</h1>
                <p>We’re excited to have you on board! CitizenConnect360 empowers you to:</p>
                <ul>
                    <li>Access and learn about essential government documents.</li>
                    <li>Report incidents in your community and track their resolutions.</li>
                    <li>Participate in public polls and voice your opinions.</li>
                    <li>Receive AI-driven insights on civil matters</li>
                </ul>
                <p>Get started now by logging in and exploring the platform.</p>
                <p>Best regards, <br/>OurVoice Team</p>
            `,
        });
    } catch (error) {
        console.error('Error while sending email', error);
    }
}

// New function to send password reset email
export async function sendResetPasswordEmail(recipient, resetUrl) {
    try {
        await transporter.sendMail({
            from: `Our Voice Team <${process.env.EMAIL_USER}>`,
            to: recipient,
            subject: `Password Reset Request`,
            html: `
                <h1>Password Reset Request</h1>
                <p>You have requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 1 hour. If you did not request this, you can ignore this email.</p>
                <p>Best regards, <br/>OurVoice Team</p>
            `,
        });
    } catch (error) {
        console.error('Error while sending reset password email', error);
    }
}
