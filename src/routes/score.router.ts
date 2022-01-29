import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import scoresController from "../controllers/scores.controller";

const router: Router = Router();

router.get("/", scoresController.getScores);
router.get("/:id", scoresController.getScore);
router.post("/", auth, scoresController.createScore);
router.patch("/:id", auth, scoresController.updateScore);
router.delete("/:id", auth, scoresController.deleteScore);

export default router;
