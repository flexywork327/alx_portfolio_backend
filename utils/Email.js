const nodemailer = require("nodemailer");
const google_user = process.env.GOOGLE_USER;
const google_password = process.env.GOOGLE_PASSWORD;

module.exports = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      post: 587,
      secure: true,
      auth: {
        user: google_user,
        pass: google_password,
      },
    });

    await transporter.sendMail({
      from: google_user,
      to: email,
      subject,
      html,
    });

    console.log("Email sent");
  } catch (error) {
    console.log(error);
    res.json({
      status: 400,
      error: error,
    });
  }
};
