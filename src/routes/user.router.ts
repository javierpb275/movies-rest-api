import { Router } from "express";
import usersController from "../controllers/users.controller";
import { auth } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/refreshToken", usersController.refreshToken);
router.post("/", usersController.createUser);
router.post("/login", usersController.login);
router.post("/logout", auth, usersController.logout);
router.get("/me", auth, usersController.getProfile);
router.patch("/me", auth, usersController.updateProfile);
router.delete("/me", auth, usersController.deleteProfile);

export default router;
