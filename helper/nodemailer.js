const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "db7f2fa3cd9ad2",
    pass: "b5c65e7978d530",
  },
});

module.exports = transport;
