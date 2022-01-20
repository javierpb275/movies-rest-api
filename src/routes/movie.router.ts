import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import moviesController from "../controllers/movies.controller";

const router: Router = Router();

router.get("/", moviesController.getMovies);
router.get("/:id", moviesController.getMovie);
router.post("/", auth, moviesController.createMovie);
router.patch("/:id", auth, moviesController.updateMovie);
router.delete("/:id", auth, moviesController.deleteMovie);

export default router;
