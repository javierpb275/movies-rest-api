import mongoose from "mongoose";
import { IMovie } from "../types";
import mongoosePaginate from "mongoose-paginate-v2";
import Review from "../models/review.model";
import Score from "../models/score.model";

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

movieSchema.plugin(mongoosePaginate);

movieSchema.pre<IMovie>("remove", async function (next) {
  const movie: IMovie = this;
  await Review.deleteMany({ movie: movie._id });
  await Score.deleteMany({ movie: movie._id });
  next();
});

export default mongoose.model<IMovie>("Movie", movieSchema);
