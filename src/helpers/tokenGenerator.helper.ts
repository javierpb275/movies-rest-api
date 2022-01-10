import jwt from "jsonwebtoken";
import { IUser } from "../types";

export const generateToken = (
  user: IUser,
  secret: string,
  expiration: string
) => {
  const token: string = jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: expiration,
  });
  return token;
};
