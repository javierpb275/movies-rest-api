import jwt from "jsonwebtoken";
import config from "../config/config";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { IUser } from "../types";

interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //get token from request header
    const authHeader: string | undefined = req.header("Authorization");
    if (!authHeader) {
      throw new Error();
    }
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    const token: string = authHeader.split(" ")[1];
    if (!token) {
      throw new Error();
    }

    const payload = jwt.verify(
      token,
      config.AUTH.ACCESS_TOKEN_SECRET
    ) as IPayload;

    const user: IUser | null = await User.findOne({
      _id: payload.id,
    });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};
