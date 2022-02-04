const nodemailer = require('nodemailer');
const ejs = require('ejs');

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.url = url || '';
        this.from = `Dmechs <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject, data = {}) {
        const html = await ejs.renderFile(`${__dirname}/../templates/${template}.ejs`, data);
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html
        };
        // console.log(process.env);
        await this.newTransport().sendMail(mailOptions);
    }

    async sendMessage(data) {
        const html = await ejs.renderFile(`${__dirname}/../templates/message.ejs`, data);
        const mailOptions = {
            to: process.env.EMAIL_FROM,
            from: process.env.EMAIL_FROM,
            subject: data.subject,
            html
        };
        
        await this.newTransport().sendMail(mailOptions);
    }

    async sendJobApplicationConfirmation(data) {
        await this.send('jobAppConfirmation', 'Job Application Confirmation', {
            ...data,
            firstName: this.firstName,
            lastName: this.lastName
        });
    }

    async sendcontactUsConfirmation(data) {
        await this.send('contactUsConfirmation', 'Support Confirmation');
    }

    async sendSellerRegisterationConfirmation(confirmation, data) {
        await this.send('sellerRegisterationConfirmation', confirmation, {
            ...data,
        });
    }

    async sendPasswordResetEmail(confirmation, data) {
        await this.send('resetPasswordEmail', confirmation, {
            ...data,
        });
    }

    async sendEmailToInbox(data) {
        await this.sendMessage(data);
    }
}

module.exports = Email;