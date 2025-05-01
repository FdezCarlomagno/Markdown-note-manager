import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { User } from '../types/models';
dotenv.config()

export class Email_Service {
    public static readonly PORT = process.env.SMTP_PORT  
    public static readonly CLIENT_URL = process.env.CLIENT_URL

    public static createTransport() {
        return nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    public static async sendVerificationCode(email: User['email'], code: string) {
        const transporter = Email_Service.createTransport()

        const mailOptions = {
            from: `"No Reply" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: "Verify Your Email",
            html: `
                <h3>Welcome!</h3>
                <p>Your verification code is:</p>
                <h2 style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">${code}</h2>
                <p>This code will expire in 1 hour.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            `
        };
        
        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.error('Error sending email:', err);
            throw err;
        }
    }
}