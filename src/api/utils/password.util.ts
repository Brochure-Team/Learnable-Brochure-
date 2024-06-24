import bcrypt from "bcrypt";

export const hash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(parseFloat(<string>process.env.ROUNDS));
  return await bcrypt.hash(password, salt);
};

export const verifyHash = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};