import { extractFileNames, DtFiles } from "./zip/index";
import { getOperators, Operator, getDtCode } from "./dt/index";
import { Email, EmailSender, Mailer } from "./email/index";

require('dotenv').config();

const { DEBUG_RECIPIENT } = process.env;


export interface PreparedDT {
    emails: Array<Email>,
    code: string,
}

export async function sendDt(zipFile: string, emailSender: EmailSender, emailBody: string) {

    const { emails } = await prepareDt(zipFile, emailBody);
    console.log(`${emails.length} mails prepared`);
    await sendEmails(emails, emailSender);

    return emails;
}

export async function prepareDt(zipFile: string, emailBody: string): Promise<PreparedDT> {
    const files = await extractFileNames(zipFile);
    const code = getDtCode(files);
    const operators = await getOperators(files.summary.content);

    const emails = prepareEmails(code, operators, files, emailBody);
    return {
        emails,
        code,
    };
}

export function prepareEmails(dtCode: string, operators: Array<Operator>, dtFiles: DtFiles, emailBody: string): Array<Email> {
    return operators.map(operator => {
        return {
            recipient: DEBUG_RECIPIENT || operator.email,
            subject: `Demande de DT ${dtCode}`,
            body: emailBody,
            attachments: [
                dtFiles.description,
                dtFiles.groundCoverage,
                dtFiles.operators[operator.index]
            ]
        };
    });
}

export function sendEmails(emails: Array<Email>, sender: EmailSender) {
    const mailer = new Mailer(sender);
    return Promise.all(emails.map(email => {
        /*console.log(`Dummy sending emails to ${email.recipient} with sender ${sender.host}, ${sender.email} ${sender.password} ${sender.replyTo}`);
        return new Promise((resolve) => {

            setTimeout(() => {
                resolve(email);
            }, 700);
        });*/
        
        return mailer.sendEmail(email)
            .then(email => {
                console.log(`Email sent to ${email.recipient} with ${email.attachments?.length} attachments.`);
                return email;
            })
    }));
}
