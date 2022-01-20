import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/tokenGenerator.helper";
import User from "../models/user.model";
import { IUser } from "../types";
import bcrypt from "bcryptjs";

//REFRESH TOKENS LIST:
let refreshTokens: string[] = [];

class UsersController {
  //REFRESH TOKEN:
  public async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.token) {
        return res.status(400).send({ error: "Please, provide refresh token" });
      }
      if (!refreshTokens.includes(req.body.token)) {
        return res.status(400).send({ error: "Refresh Token Invalid" });
      }
      //remove the old refreshToken from the refreshTokens list:
      refreshTokens = refreshTokens.filter((c) => c != req.body.token);

      //generate new accessToken and refreshTokens:
      const accessToken: string = generateAccessToken(req.body.userId);
      const refreshToken: string = generateRefreshToken(req.body.userId);

      //add refresh token
      refreshTokens.push(refreshToken);

      //respond with accessToken and refreshToken
      return res.status(200).send({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).send(error);
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
        return res.status(400).send({ error: "Wrong email. Try again" });
      }

      //create accesstoken and refreshtoken:
      const accessToken: string = generateAccessToken(newUser._id.toString());
      const refreshToken: string = generateRefreshToken(newUser._id.toString());

      //add refresh token
      refreshTokens.push(refreshToken);

      //save user:
      await newUser.save();

      //respond with user, accesstoken and refreshtoken
      return res.status(201).send({
        user: newUser,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  //LOGIN:
  public async login(req: Request, res: Response): Promise<Response> {
    //check if there is an email and a password:
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ error: "Please, send your email and password" });
    }

    try {
      //check if user exist:
      const foundUser: IUser | null = await User.findOne({
        email: req.body.email,
      });
      if (!foundUser) {
        return res.status(400).send({ error: "Wrong credentials" });
      }

      //check password:
      const isMatch: boolean = await foundUser.comparePassword(
        req.body.password
      );
      if (!isMatch) {
        return res.status(400).send({ error: "Wrong credentials" });
      }

      //create accesstoken and refreshtoken:
      const accessToken: string = generateAccessToken(foundUser._id.toString());
      const refreshToken: string = generateRefreshToken(
        foundUser._id.toString()
      );

      //add refresh token
      refreshTokens.push(refreshToken);

      //respond with user, accesstoken and refreshtoken
      return res.status(200).send({
        user: foundUser,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(400).send({ error: "Unable to log in" });
    }
  }

  //LOGOUT:
  public async logout(req: Request, res: Response): Promise<Response> {
    if (!req.body.token) {
      return res.status(400).send({ error: "Please, provide refresh token" });
    }
    if (!refreshTokens.includes(req.body.token)) {
      return res.status(400).send({ error: "Refresh Token Invalid" });
    }
    try {
      //remove the old refreshToken from the refreshTokens list
      refreshTokens = refreshTokens.filter((c) => c != req.body.token);

      return res.status(200).send({ message: "logged out successfully" });
    } catch (error) {
      return res.status(500).send({ error: "Unable to log out" });
    }
  }

  //GET PROFILE:
  public async getProfile(req: Request, res: Response): Promise<Response> {
    //get user from request
    const { userId } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      //populate lists of movies
      await user.populate({ path: "lists", populate: { path: "movies" } });
      //respond with user
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send(error);
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
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }

      //if the password is changed, we have to encrypt it before save it:
      if (body.password) {
        const rounds: number = 10;
        const salt: string = await bcrypt.genSalt(rounds);
        const hash: string = await bcrypt.hash(body.password, salt);
        body.password = hash;
      }

      const updatedUser = await User.findOneAndUpdate({ _id: userId }, body, {
        new: true,
      });

      //respond with updated user
      return res.status(200).send(updatedUser);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  //DELETE PROFILE:
  public async deleteProfile(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    if (!req.body.token) {
      return res.status(400).send({ error: "Please, provide refresh token" });
    }
    if (!refreshTokens.includes(req.body.token)) {
      return res.status(400).send({ error: "Refresh Token Invalid" });
    }
    try {
      const user: IUser | null = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }

      await user.remove();

      //remove the old refreshToken from the refreshTokens list
      refreshTokens = refreshTokens.filter((c) => c != req.body.token);

      //respond with deleted user
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

const usersController = new UsersController();

export default usersController;
