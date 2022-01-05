import app from "./app";
import dotenv from "dotenv";
import { startMongooseConnection } from "./db/mongoose";

dotenv.config();

startMongooseConnection();

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
