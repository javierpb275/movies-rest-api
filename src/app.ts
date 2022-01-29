import express, { Application } from "express";
import cors from "cors";
import userRouter from "./routes/user.router";
import movieRouter from "./routes/movie.router";
import listRouter from "./routes/list.router";
import reviewRouter from "./routes/review.router";
import scoreRouter from "./routes/score.router";

const app: Application = express();

//settings
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/lists", listRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/scores", scoreRouter);

export default app;
