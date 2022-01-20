import { Request, Response } from "express";
import { IUser } from "../types";
import User from "../models/user.model";
import Movie from "../models/movie.model";
import { IMovie } from "../types";

class MoviesController {
  public async getMovies(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("getMovies");
    } catch (error) {
      return res.status(500).send({ error: "Unable to get movies" });
    }
  }

  public async getMovie(req: Request, res: Response): Promise<Response> {
    const { params } = req;
    try {
      const movie: IMovie | null = await Movie.findOne({ _id: params.id });
      if (!movie) {
        return res.status(404).send({ error: "Movie Not Found!" });
      }
      return res.status(200).send(movie);
    } catch (error) {
      return res.status(500).send(error);
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
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  public async updateMovie(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("updateMovie");
    } catch (error) {
      return res.status(500).send({ error: "Unable to update movie" });
    }
  }

  public async deleteMovie(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("deleteMovie");
    } catch (error) {
      return res.status(500).send({ error: "Unable to delete movie" });
    }
  }
}

const moviesController = new MoviesController();

export default moviesController;
