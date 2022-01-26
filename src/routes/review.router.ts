import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import reviewsController from "../controllers/reviews.controller";

const router: Router = Router();

router.get("/", reviewsController.getReviews);
router.get("/:id", reviewsController.getReview);
router.post("/", auth, reviewsController.createReview);
router.patch("/:id", auth, reviewsController.updateReview);
router.delete("/:id", auth, reviewsController.deleteReview);

export default router;
