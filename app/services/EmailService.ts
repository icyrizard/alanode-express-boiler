import nodemailer from 'nodemailer';

export default class EmailService {
    createTransporter() {
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    async send(options) {
        const {
            from,
            to,
            subject,
            text,
            html
        } = options;

        const transporter = this.createTransporter();

        // send mail with defined transport object
        return await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html,
        });
    }
}