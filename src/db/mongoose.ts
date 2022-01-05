import mongoose from "mongoose";
import config from "../config/config";

export const startMongooseConnection = async (): Promise<void> => {
  try {
    const db = await mongoose.connect(config.DB.URI);
    console.log(`Success: connected to db`);
  } catch (error) {
    console.log(`Error: unable to connect to db`);
  }
};
