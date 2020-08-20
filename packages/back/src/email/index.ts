import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Operator } from '../dt/index';

export interface EmailSender {
    host: string,
    port: number,
    email: string,
    password: string,
}

export interface Email {
    recipient: string,
    subject: string,
    body: string,
    attachments: Array<Attachment>
}

export interface Attachment {
    filename: string, 
    content: Buffer
}

export class Mailer {

    private transporter: Mail;

    constructor(private readonly sender: EmailSender) {
        this.transporter = nodemailer.createTransport({
            host: sender.host,
            port: sender.port,
            secure: true,
            auth: {
                user: sender.email,
                pass: sender.password,
            }
        });
    }

    sendEmail(email: Email) {
        return this.transporter.sendMail({
            from: this.sender.email,
            to: email.recipient,
            subject: email.subject,
            html: email.body,
            attachments: email.attachments
        })
    }

    verify() {
        return this.transporter.verify();
    }
}
