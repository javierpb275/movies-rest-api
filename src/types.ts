import mongoose from "mongoose";

//MOVIE

export interface IMovie extends mongoose.Document {
  imgUrl: string;
  title: string;
  year: number;
  directors: string[];
  cast: string[];
  screenWriters: string[];
  genres: string[];
  synopsis: string;
}

//USER

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  isAdmin: boolean;
  token?: string;
}

//LIST

export interface IList extends mongoose.Document {
  name: string;
  movies: IMovie[];
  user: IUser;
}

//REVIEW

type Opinion = "bad" | "mediocre" | "good";

export interface IReview extends mongoose.Document {
  comment: string;
  opinion: Opinion;
  movie: IMovie;
  user: IUser;
}

//SCORE

type Points = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface IScore extends mongoose.Document {
  points: Points;
  movie: IMovie;
  user: IUser;
}
