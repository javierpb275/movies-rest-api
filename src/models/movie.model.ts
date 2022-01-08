import mongoose from "mongoose";
import { IMovie } from "../types";

const movieSchema = new mongoose.Schema<IMovie>(
  {
    imgUrl: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    year: {
      type: Number,
      validate(value: number) {
        if (value < 1888) {
          throw new Error("No movies have been made before 1888");
        }
      },
    },
    synopsis: {
      type: String,
      trim: true,
    },
    directors: [
      {
        type: String,
        trim: true,
      },
    ],
    cast: [
      {
        type: String,
        trim: true,
      },
    ],
    screenWriters: [
      {
        type: String,
        trim: true,
      },
    ],
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    scores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Score",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMovie>("Movie", movieSchema);
