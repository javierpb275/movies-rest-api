import { Request, Response } from "express";
//import Movie from "../models/movie.model";
//import { IMovie } from "../types";

class MoviesController {
  public async getMovies(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("getMovies");
    } catch (error) {
      return res.status(500).send({ error: "Unable to get movies" });
    }
  }

  public async getMovie(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("getMovie");
    } catch (error) {
      return res.status(500).send({ error: "Unable to get movie" });
    }
  }

  public async createMovie(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).send("createMovie");
    } catch (error) {
      return res.status(500).send({ error: "Unable to create movies" });
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
