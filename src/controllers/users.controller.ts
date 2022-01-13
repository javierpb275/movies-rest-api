import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/tokenGenerator.helper";
import User from "../models/user.model";
import { IUser } from "../types";

//REFRESH TOKENS LIST:
let refreshTokens: string[] = [];

class UsersController {
  //REFRESH TOKEN:
  public async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      if (!refreshTokens.includes(req.body.token)) {
        return res.status(400).send("Refresh Token Invalid");
      }

      //remove the old refreshToken from the refreshTokens list:
      refreshTokens = refreshTokens.filter((c) => c != req.body.token);

      //generate new accessToken and refreshTokens:
      const accessToken: string = generateAccessToken(req.body.userId);
      const refreshToken: string = generateRefreshToken(req.body.userId);

      //add refresh token
      refreshTokens.push(refreshToken);

      return res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

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
      const accessToken: string = generateAccessToken(newUser._id.toString());
      const refreshToken: string = generateRefreshToken(newUser._id.toString());

      //save user:
      await newUser.save();

      //add refresh token
      refreshTokens.push(refreshToken);

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
    //check if there is an email and a password:
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

      //check password:
      const isMatch: boolean = await foundUser.comparePassword(
        req.body.password
      );
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong credentials" });
      }

      //create accesstoken and refreshtoken:
      const accessToken: string = generateAccessToken(foundUser._id.toString());
      const refreshToken: string = generateRefreshToken(
        foundUser._id.toString()
      );

      //add refresh token
      refreshTokens.push(refreshToken);

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
      //remove the old refreshToken from the refreshTokens list
      refreshTokens = refreshTokens.filter((c) => c != req.body.token);

      return res
        .status(200)
        .json({ message: "success logging out", theUser: req.user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  //GET PROFILE:
  public async getProfile(req: Request, res: Response): Promise<Response> {
    const { user } = req;
    return res.status(200).json({ user });
  }

  //UPDATE PROFILE:
  public async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      return res
        .status(200)
        .json({ message: "success updating profile", theUser: req.user });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  //DELETE PROFILE:
  public async deleteProfile(req: Request, res: Response): Promise<Response> {
    try {
      return res
        .status(200)
        .json({ message: "success deleting profile", theUser: req.user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}

const usersController = new UsersController();

export default usersController;
