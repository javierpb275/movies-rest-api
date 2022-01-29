import { Request, Response } from "express";
import { IScore, IUser } from "../types";
import User from "../models/user.model";
import Score from "../models/score.model";
import { validateBodyProperties } from "../helpers/validateRequest.helper";
import { getMatch, getPaginationOptions } from "../helpers/paginator.helper";

class ReviewsController {
  public async getScores(req: Request, res: Response): Promise<Response> {
    const { query } = req;
    const { limit, skip, sort } = getPaginationOptions(query);
    const match = getMatch(query);
    try {
      const allScores: IScore[] = await Score.find(match)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      return res.status(200).send(allScores);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async getScore(req: Request, res: Response): Promise<Response> {
    const { params } = req;
    try {
      const score: IScore | null = await Score.findOne({ _id: params.id });
      if (!score) {
        return res.status(404).send({ error: "Score Not Found!" });
      }
      await score.populate("movie");
      return res.status(200).send(score);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async createScore(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const newScore: IScore = new Score({ ...body, user: user._id });
      await newScore.save();
      return res.status(201).send(newScore);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async updateScore(req: Request, res: Response): Promise<Response> {
    const { userId, body, params } = req;
    //allow only certain properties to be updated:
    const isValidOperation: boolean = validateBodyProperties(body, ["points"]);
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid properties!" });
    }
    //-------------------------
    try {
      const updatedScore: IScore | null = await Score.findOneAndUpdate(
        { _id: params.id, user: userId },
        body,
        {
          new: true,
        }
      );
      if (!updatedScore) {
        return res.status(404).send({ error: "Score Not Found!" });
      }
      return res.status(200).send(updatedScore);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async deleteScore(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const score: IScore | null = await Score.findOne({
        _id: params.id,
        user: userId,
      });
      if (!score) {
        return res.status(404).send({ error: "Score Not Found!" });
      }
      await score.remove();
      return res.status(200).send(score);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const reviewsController: ReviewsController = new ReviewsController();

export default reviewsController;
