const nodemailer = require("nodemailer");

module.exports = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      post: 587,
      secure: true,
      auth: {
        user: "flexywork327@gmail.com",
        pass: "fxlrxghcybanlsjo",
      },
    });

    await transporter.sendMail({
      from: "flexywork327@gmail.com",
      to: email,
      subject,
      text,
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
