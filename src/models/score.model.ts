import mongoose from "mongoose";
import { IScore, Points } from "../types";

const scoreSchema = new mongoose.Schema<IScore>(
  {
    points: {
      type: Number,
      required: true,
      enum: Points,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScore>("Score", scoreSchema);
