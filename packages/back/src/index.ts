require('dotenv').config();

import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import { Email } from './email/index';
import { sendDt, prepareDt, PreparedDT } from './rene';


const { SENDER_EMAIL, SENDER_HOST, SENDER_PASSWORD } = process.env;
if(!SENDER_EMAIL || !SENDER_HOST || !SENDER_PASSWORD) {
    throw new Error('You must set all mandatory environment variables SENDER_EMAIL, SENDER_PASSWORD and SENDER_HOST');
}


function emailsForFront(emails: Array<Email>) {
    return emails.map(email => {
        return {
            ...email,
            attachments: email.attachments.map(attachment => attachment.filename)
        };
    });
}

const app = express();
const port = 3000;

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/rene'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
    console.warn('Allowing CORS from any origin');
    app.use(cors());
}

app.post('/send', (req, res) => {
    const zip = req.files?.attachment as UploadedFile;

    if (!SENDER_HOST || !SENDER_EMAIL || !SENDER_PASSWORD) {
        res.status(500);
        res.json({
            error: 'The server must be configured with SMTP host, email and password to send emails!',
        });
        res.end();
        return;
    }

    const emailSender = {
        host: SENDER_HOST,
        email: SENDER_EMAIL,
        replyTo: req.body.email,
        port: 465,
        password: SENDER_PASSWORD,
    }

    const emailBody = req.body.emailBody;

    sendDt(zip.tempFilePath, emailSender, emailBody)
        .then(emails => {
            console.log('All emails sent.');
            res.json(emailsForFront(emails));
            res.end();
        });
})


app.post('/prepare', (req, res) => {
    const zip = req.files?.attachment as UploadedFile;

    const emailBody = req.body.emailBody;

    prepareDt(zip.tempFilePath, emailBody)
        .then(({ emails, code }: PreparedDT) => {
            res.json({
                emails: emailsForFront(emails),
                code,
            });
            res.end();
        });
})


app.listen(port, () => {

    console.log(`Ready to send emails from ${SENDER_EMAIL} with host ${SENDER_HOST}`);

    const { DEBUG_RECIPIENT } = process.env;
    if (DEBUG_RECIPIENT) {
        console.log(`Debug mode, emails will always to sent to ${DEBUG_RECIPIENT}.`);
    }

    console.log(`Running on port ${port}`);
});
