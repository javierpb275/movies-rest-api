import { Request, Response } from "express";

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
    try {
      return res.status(201).send("createReview");
    } catch (err) {
      return res.status(400).send(err);
    }
  }
  public async updateReview(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("updateReview");
    } catch (err) {
      return res.status(400).send(err);
    }
  }
  public async deleteReview(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("deleteReview");
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const reviewsController: ReviewsController = new ReviewsController();

export default reviewsController;
