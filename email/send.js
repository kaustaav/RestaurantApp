const nodemailer = require('nodemailer');
const keys = require('../config/keys');

const credentials = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: keys.senderEmail,
        pass: keys.senderEmailPass
    }
}

const transporter = nodemailer.createTransport(credentials);

module.exports = async (to, content) => {
    const contacts = {
        from: keys.senderEmail,
        to
    }

    const email = Object.assign({}, content, contacts)

    await transporter.sendMail(email);
}