import { Request, Response } from "express";
import config from "../config/config";
import { generateToken } from "../helpers/tokenGenerator.helper";
import User from "../models/user.model";
import { IUser } from "../types";

class UsersController {
  //CREATE USER:
  public async createUser(req: Request, res: Response): Promise<Response> {
    //create newUser:
    const newUser: IUser = new User(req.body);
    try {
      //check if user exist:
      const foundUser: IUser | null = await User.findOne({
        email: req.body.email,
      });
      if (foundUser) {
        return res.status(400).json({ message: "Wrong email. Try again" });
      }
      //create accesstoken and refreshtoken:
      const accessToken: string = generateToken(
        newUser,
        config.AUTH.ACCESS_TOKEN_SECRET,
        "15m"
      );
      const refreshToken: string = generateToken(
        newUser,
        config.AUTH.REFRESH_TOKEN_SECRET,
        "20m"
      );

      //add refreshtoken to tokens array and save user:
      newUser.tokens.push(refreshToken);
      await newUser.save();

      //respond with user, accesstoken and refreshtoken
      return res.status(201).json({
        user: newUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  //LOGIN:
  public async login(req: Request, res: Response): Promise<Response> {
    //check if there is and email and a password:
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Please, Send your email and password" });
    }
    try {
      //check if user exist:
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
      //create accesstoken and refreshtoken:
      const accessToken: string = generateToken(
        foundUser,
        config.AUTH.ACCESS_TOKEN_SECRET,
        "15m"
      );
      const refreshToken: string = generateToken(
        foundUser,
        config.AUTH.REFRESH_TOKEN_SECRET,
        "20m"
      );

      //add refreshtoken to tokens array and save user:
      foundUser.tokens.push(refreshToken);
      await foundUser.save();

      //respond with user, accesstoken and refreshtoken
      return res.status(200).json({
        user: foundUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
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
