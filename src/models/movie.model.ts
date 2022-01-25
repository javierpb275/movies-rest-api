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
  },
  {
    timestamps: true,
  }
);

movieSchema.plugin(mongoosePaginate);

movieSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "movie",
});

movieSchema.virtual("scores", {
  ref: "Score",
  localField: "_id",
  foreignField: "movie",
});

movieSchema.set("toObject", { virtuals: true });
movieSchema.set("toJSON", { virtuals: true });

movieSchema.pre<IMovie>("remove", async function (next) {
  const movie: IMovie = this;
  await Review.deleteMany({ movie: movie._id });
  await Score.deleteMany({ movie: movie._id });
  next();
});

export default mongoose.model<IMovie>("Movie", movieSchema);
