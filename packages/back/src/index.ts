
import { extractFileNames, DtFiles } from "./zip/index";
import { getOperators, Operator } from "./dt/index";
import { Mailer } from "./email/index";


const { EMAIL_PASSWORD } = process.env

exports.handler = function(event: any, context: any, callback: any) {

    const formPayload = JSON.parse(event.body).payload;

    const zipFile = formPayload.attachment;

    sendDt(zipFile)
    .then((emails) => {

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(emails)
        });
    })
}

async function sendDt(zipFile: string) {

    const files = await extractFileNames(zipFile);
    const operators = await getOperators(files.summary.content);
    const emails = sendDummyEmails('Hello', operators, files);
    return emails;
}

function sendDummyEmails(dtCode: string, operators: Array<Operator>, dtFiles: DtFiles) {
    const mailer = new Mailer({
        host: 'smtp.gmail.com',
        email: 'laure.chausse@gmail.com',
        port: 465,
        password: EMAIL_PASSWORD ?? '',
    });

    operators.slice(0, 2).forEach(operator => {

        mailer.sendEmail({
            recipient: 'laure.chausse@gmail.com',
            subject: 'Sending to ' + operator.email,
            body: 'Some stuff',
            attachments: [
                dtFiles.description,
                dtFiles.groundCoverage,
                dtFiles.operators[operator.index]
            ]
        });
    })

}
