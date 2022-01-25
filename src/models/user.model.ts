import mongoose from "mongoose";
import { IUser, Role } from "../types";
import validator from "validator";
import bcrypt from "bcryptjs";
import Review from "../models/review.model";
import Score from "../models/score.model";
import List from "../models/list.model";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate(value: string) {
        const strongRegex: RegExp = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        );
        if (!value.match(strongRegex)) {
          throw new Error("Password is not secure");
        }
      },
    },
    role: {
      type: String,
      enum: Role,
      default: Role.USER,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);

userSchema.virtual("lists", {
  ref: "List",
  localField: "_id",
  foreignField: "user",
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.role;
  return userObject;
};

userSchema.pre<IUser>("save", async function (next) {
  const user: IUser = this;
  if (!user.isModified("password")) {
    return next();
  }
  const rounds: number = 10;
  const salt: string = await bcrypt.genSalt(rounds);
  const hash: string = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.pre<IUser>("remove", async function (next) {
  const user: IUser = this;
  await Review.deleteMany({ user: user._id });
  await Score.deleteMany({ user: user._id });
  await List.deleteMany({ user: user._id });
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
