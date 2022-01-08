import { Request, Response } from "express";
import User from "../models/user.model";
import { IUser } from "../types";

class UsersController {
  public async createUser(req: Request, res: Response): Promise<Response> {
    const newUser: IUser = new User(req.body);
    try {
      await newUser.save();
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}

const usersController = new UsersController();

export default usersController;
