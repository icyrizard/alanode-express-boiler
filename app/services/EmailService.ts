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
            from: from, //'"Fred Foo 👻" <foo@example.com>', // sender address
            to: to, //"bar@example.com, baz@example.com", // list of receivers
            subject: subject, //"Hello ✔", // Subject line
            text: text, // "Hello world?", // plain text body
            html: html, //"<b>Hello world?</b>", // html body
        });
    }
}