const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const smtpTransport = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    smtpTransport
}