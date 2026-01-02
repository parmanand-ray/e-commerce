import nodemailer from "nodemailer";

export const sendMail = async (subject, receiver, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  try {
    await transporter.verify();
    const options = {
      from: `"Devloper Parmanand" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject: subject,
      html: body,
    };

    await transporter.sendMail(options);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
