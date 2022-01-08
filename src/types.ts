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
  reviews: IReview[]; //HAS MANY REVIEWS
  scores: IScore[]; //HAS MANY SCORES
}

//USER

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  role: Role;
  lists: IList[]; //HAS MANY LISTS OF MOVIES
  comparePassword: (password: string) => Promise<boolean>;
}

//LIST

export interface IList extends mongoose.Document {
  name: string;
  movies: IMovie[]; //HAS MANY MOVIES
  user: IUser; //IS MADE BY SOME USER
}

//REVIEW

export enum Opinion {
  BAD = "bad",
  MEDIOCRE = "mediocre",
  GOOD = "good",
}

export interface IReview extends mongoose.Document {
  comment: string;
  opinion: Opinion;
  movie: IMovie; //BELONGS TO SOME MOVIE
  user: IUser; //IS MADE BY SOME USER
}

//SCORE

export enum Points {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
}

export interface IScore extends mongoose.Document {
  points: Points;
  movie: IMovie; //BELONGS TO A MOVIE
  user: IUser; //IS MADE BY SOME USER
}
