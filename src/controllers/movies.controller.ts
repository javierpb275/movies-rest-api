import { Request, Response } from "express";
import { IUser } from "../types";
import User from "../models/user.model";
import Movie from "../models/movie.model";
import { IMovie } from "../types";
import { getPaginationOptions, getMatch } from "../helpers/paginator.helper";

class MoviesController {
  public async getMovies(req: Request, res: Response): Promise<Response> {
    const { query } = req;
    const { limit, skip, sort } = getPaginationOptions(
      query.limit?.toString(),
      query.skip?.toString(),
      query.sort?.toString()
    );
    const filter = getMatch(query);
    try {
      const allMovies: IMovie[] = await Movie.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("scores");
      return res.status(200).send(allMovies);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async getMovie(req: Request, res: Response): Promise<Response> {
    const { params } = req;
    try {
      const movie: IMovie | null = await Movie.findOne({ _id: params.id });
      if (!movie) {
        return res.status(404).send({ error: "Movie Not Found!" });
      }
      await movie.populate([
        { path: "reviews", populate: { path: "user" } },
        { path: "scores" },
      ]);
      return res.status(200).send(movie);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public async createMovie(req: Request, res: Response): Promise<Response> {
    const { userId, body } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (user.role !== "ADMIN") {
        return res.status(401).send({ error: "You are not authorized!" });
      }
      const newMovie: IMovie = new Movie(body);
      await newMovie.save();
      return res.status(201).send(newMovie);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async updateMovie(req: Request, res: Response): Promise<Response> {
    const { userId, body, params } = req;
    //allow only certain propeties to be updated:
    const updates: string[] = Object.keys(body);
    const allowedUpdates: string[] = [
      "imgUrl",
      "title",
      "year",
      "synopsis",
      "directors",
      "cast",
      "screenWriters",
      "genres",
    ];
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
      if (user.role !== "ADMIN") {
        return res.status(401).send({ error: "You are not authorized!" });
      }
      const updatedMovie: IMovie | null = await Movie.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
        }
      );
      if (!updatedMovie) {
        return res.status(404).send({ error: "Movie Not Found!" });
      }
      return res.status(200).send(updatedMovie);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  public async deleteMovie(req: Request, res: Response): Promise<Response> {
    const { userId, params } = req;
    try {
      const user: IUser | null = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ error: "User Not Found!" });
      }
      if (user.role !== "ADMIN") {
        return res.status(401).send({ error: "You are not authorized!" });
      }
      const deletedMovie: IMovie | null = await Movie.findOneAndDelete({
        _id: params.id,
      });
      if (!deletedMovie) {
        return res.status(404).send({ error: "Movie Not Found!" });
      }
      return res.status(200).send(deletedMovie);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}

const moviesController: MoviesController = new MoviesController();

export default moviesController;
