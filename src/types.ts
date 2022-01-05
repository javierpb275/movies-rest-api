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

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  isAdmin: boolean;
  token?: string;
  lists: IList[]; //HAS MANY LISTS OF MOVIES
}

//LIST

export interface IList extends mongoose.Document {
  name: string;
  movies: IMovie[]; //HAS MANY MOVIES
  user: IUser; //IS MADE BY SOME USER
}

//REVIEW

type Opinion = "bad" | "mediocre" | "good";

export interface IReview extends mongoose.Document {
  comment: string;
  opinion: Opinion;
  movie: IMovie; //BELONGS TO SOME MOVIE
  user: IUser; //IS MADE BY SOME USER
}

//SCORE

type Points = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface IScore extends mongoose.Document {
  points: Points;
  movie: IMovie; //BELONGS TO A MOVIE
  user: IUser; //IS MADE BY SOME USER
}
