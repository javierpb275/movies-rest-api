import mongoose from "mongoose";
import { IList } from "../types";

const listSchema = new mongoose.Schema<IList>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IList>("List", listSchema);
