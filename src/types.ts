import mongoose, { ObjectId } from "mongoose";

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
  reviews: ObjectId[]; //HAS MANY REVIEWS
  scores: ObjectId[]; //HAS MANY SCORES
}

//USER

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  isAdmin: boolean;
  lists: ObjectId[]; //HAS MANY LISTS OF MOVIES
}

//LIST

export interface IList extends mongoose.Document {
  name: string;
  movies: ObjectId[]; //HAS MANY MOVIES
  user: ObjectId; //IS MADE BY SOME USER
}

//REVIEW

type Opinion = "bad" | "mediocre" | "good";

export interface IReview extends mongoose.Document {
  comment: string;
  opinion: Opinion;
  movie: ObjectId; //BELONGS TO SOME MOVIE
  user: ObjectId; //IS MADE BY SOME USER
}

//SCORE

type Points = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface IScore extends mongoose.Document {
  points: Points;
  movie: ObjectId; //BELONGS TO A MOVIE
  user: ObjectId; //IS MADE BY SOME USER
}
