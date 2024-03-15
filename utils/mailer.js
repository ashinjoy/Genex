const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.mail, pass: process.env.password },
});

async function sendMail(otp, email) {
  try {
    const mailoptions = {
      from: process.env.mail,
      to: email,
      subject: "GEN-Z Clothing signup verification",
      text: `verification otp:${otp}`,
    };

    const mailtransfered = await transport.sendMail(mailoptions);
    if (mailtransfered) {
      console.log("mail transfered successfully");
    }
  } catch (err) {
    console.error(err);
  }
}
async function sendLink(link, mail) {
  try {
    // const encodedLink = encodeURIComponent(link);
    const options = {
      from: process.env.mail,
      to: mail,
      subject: "Password Assistance",
      html: `<a href="${link}">click to change password</a>`,
    };
    const passwordchange = await transport.sendMail(options);
    if (passwordchange) {
      console.log("link reached email");
    }
  } catch (error) {
    console.error(error);
  }
}
module.exports = { sendMail, sendLink };
