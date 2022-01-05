import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

//settings
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.get("/helloworld", (req, res) => res.send("hello world"));

export default app;
