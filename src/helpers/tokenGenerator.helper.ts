import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateToken = (
  userId: string,
  secret: string,
  expiration: string
) => {
  const token: string = jwt.sign({ id: userId }, secret, {
    expiresIn: expiration,
  });
  return token;
};

export const generateAccessToken = (userId: string) => {
  const token: string = jwt.sign(
    { id: userId },
    config.AUTH.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  return token;
};

export const generateRefreshToken = (userId: string) => {
  const token: string = jwt.sign(
    { id: userId },
    config.AUTH.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "20m",
    }
  );

  return token;
};
