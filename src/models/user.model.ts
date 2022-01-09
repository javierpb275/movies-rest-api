import mongoose from "mongoose";
import { IUser, Role } from "../types";
import validator from "validator";
import bcrypt from "bcryptjs";

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
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
  },
  {
    timestamps: true,
  }
);

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

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
