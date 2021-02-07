export interface EmailConfiguration {
    email: string,
    message: string,
}

export interface Email {
    recipient: string,
    subject: string,
    body: string,
    attachments: Array<string>
}
