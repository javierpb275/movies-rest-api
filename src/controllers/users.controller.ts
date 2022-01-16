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

      //respond with accessToken and refreshToken
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
      return res.status(400).json({ message: error });
    }
  }

  //LOGOUT:
  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      //remove the old refreshToken from the refreshTokens list
      refreshTokens = refreshTokens.filter((c) => c != req.body.token);
      return res.status(200).json({ message: "logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  //GET PROFILE:
  public async getProfile(req: Request, res: Response): Promise<Response> {
    //get user from request
    const { userId } = req;
    try {
      const user: IUser | null = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User Not Found!" });
      }
      //populate lists of movies
      await user.populate({ path: "lists", populate: { path: "movies" } });
      //respond with user
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  //UPDATE PROFILE:
  public async updateProfile(req: Request, res: Response): Promise<Response> {
    const { body, userId } = req;
    //allow only certain propeties to be updated:
    const updates: string[] = Object.keys(body);
    const allowedUpdates: string[] = ["username", "email", "password", "lists"];
    const isValidOperation: boolean = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    //-------------------------
    try {
      const user: IUser | null = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User Not Found!" });
      }

      const updatedUser = await User.findOneAndUpdate({ _id: userId }, body, {
        new: true,
      });

      //respond with updated user
      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  //DELETE PROFILE:
  public async deleteProfile(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    try {
      const user: IUser | null = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User Not Found!" });
      }
      await user.remove();
      //respond with deleted user
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}

const usersController = new UsersController();

export default usersController;
