import nodemailer from "nodemailer";
import { IUser } from "../api/interfaces";
import { capitalizeString } from "../api/utils";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const mailOptions = (
  recipient: IUser,
  subject: string,
  content: string
) => {
  return {
    from: process.env.MAIL_ADDRESS,
    to: recipient.email,
    subject: subject,
    replyTo: process.env.MAIL_ADDRESS,
    sender: "The LearnWave Team",
    html: `<!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif;">
        <div style="display: block; margin: auto; max-width: 600px;" class="main">
        <div>
            <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Hello, ${capitalizeString(
              recipient.fullName
            )}!</h1>
            ${content}
              </div>
              <div>
              <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">The LearnWave Team</h1>
              </div>
              </div>
              <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
              <style>
                .main { background-color: white; }
                a:hover { border-left-width: 1em; min-height: 2em; }
              </style>
            </body>
          </html>`,
  };
};
