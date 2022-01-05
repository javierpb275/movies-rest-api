import { IUser } from "./src/types";

declare namespace Express {
  export interface Request {
    user: IUser;
    token: string;
  }
}
