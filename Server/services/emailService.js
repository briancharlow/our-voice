import nodemailer from 'nodemailer';

import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; //HELPER TO LOCATE OUR POSITION OF DB.JS

//GETTING OUR CURRENT LOCATION(of the file (in this case db.js))
const __filename = fileURLToPath(import.meta.url);
//GETTING THE LOCATION OF THE DIRECTORY WE ARE IN(config)
const __dirname = path.dirname(__filename);
//POINTING TO THE .ENV FILE SO WE CAN EXTRACT THE VARIABLES IIN THERE
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	// port: 587,
	// secure: false, // true for port 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export async function sendWelcomeEmail(recipient) {
	try {
		await transporter.sendMail({
			from: `Our Voice Team <${process.env.EMAIL_USER}>`,
			to: `${recipient}`,
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
