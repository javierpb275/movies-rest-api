import mongoose from "mongoose";
import { IReview, Opinion } from "../types";
import mongoosePaginate from "mongoose-paginate-v2";

const reviewSchema = new mongoose.Schema<IReview>(
  {
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    opinion: {
      type: String,
      required: true,
      enum: Opinion,
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

reviewSchema.plugin(mongoosePaginate);

export default mongoose.model<IReview>("Review", reviewSchema);
