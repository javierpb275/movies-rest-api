import { Request, Response } from "express";
import User from "../models/user.model";
import { IUser } from "../types";

class UsersController {
  //CREATE USER:
  public async createUser(req: Request, res: Response): Promise<Response> {
    const newUser: IUser = new User(req.body);
    try {
      const foundUser: IUser | null = await User.findOne({
        email: req.body.email,
      });
      if (foundUser) {
        return res.status(400).json({ message: "Wrong email. Try again" });
      }
      await newUser.save();
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  //LOGIN:
  public async login(req: Request, res: Response): Promise<Response> {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Please, Send your email and password" });
    }
    try {
      const foundUser: IUser | null = await User.findOne({
        email: req.body.email,
      });
      if (!foundUser) {
        return res.status(400).json({ message: "Wrong credentials" });
      }
      const isMatch: boolean = await foundUser.comparePassword(
        req.body.password
      );
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong credentials" });
      }
      return res.status(200).json(foundUser);
    } catch (error) {
      return res.status(400).json({ message: "Unable to login" });
    }
  }

  //LOGOUT:
  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "success logging out" });
    } catch (error) {
      return res.status(500).send();
    }
  }

  //GET PROFILE:
  public async getProfile(req: Request, res: Response): Promise<Response> {
    return res.status(200).json("my user");
  }

  //UPDATE PROFILE:
  public async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "success updating profile" });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  //DELETE PROFILE:
  public async deleteProfile(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({ message: "success deleting profile" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}

const usersController = new UsersController();

export default usersController;
