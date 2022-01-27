import { Request, Response } from "express";
import { IReview, IUser } from "../types";
import User from "../models/user.model";
import Review from "../models/review.model";
import { validateBodyProperties } from "../helpers/validateRequest.helper";

class ReviewsController {
  public async getReviews(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("getReviews");
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async getReview(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("getReview");
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async createReview(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      const newReview: IReview = new Review({ ...body, user: user._id });
      await newReview.save();
      return res.status(201).send(newReview);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async updateReview(req: Request, res: Response): Promise<Response> {
    const { userId, body, params } = req;
    //allow only certain properties to be updated:
    const isValidOperation: boolean = validateBodyProperties(body, [
      "comment",
      "opinion",
    ]);
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid properties!" });
    }
    //-------------------------
    try {
      const updatedReview: IReview | null = await Review.findOneAndUpdate(
        { _id: params.id, user: userId },
        body,
        {
          new: true,
        }
      );
      if (!updatedReview) {
        return res.status(404).send({ error: "Review Not Found!" });
      }
      return res.status(200).send(updatedReview);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async deleteReview(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const review: IReview | null = await Review.findOne({
        _id: params.id,
        user: userId,
      });
      if (!review) {
        return res.status(404).send({ error: "Review Not Found!" });
      }
      await review.remove();
      return res.status(200).send(review);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const reviewsController: ReviewsController = new ReviewsController();

export default reviewsController;
