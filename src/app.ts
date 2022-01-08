import express, { Application } from "express";
import cors from "cors";
import userRouter from "./routes/user.router";

const app: Application = express();

//settings
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/users", userRouter);

export default app;
