import { IUser } from "../interfaces";
import { transporter, mailOptions } from "../../configs";

export default async (
  recipient: IUser,
  subject: string,
  content: string
) => {
  return await transporter.sendMail(mailOptions(recipient, subject, content));
};