import { Router } from "express";
import usersController from "../controllers/users.controller";

const router: Router = Router();

router.post("/refreshToken", usersController.refreshToken);
router.post("/", usersController.createUser);
router.post("/login", usersController.login);
router.post("/logout", usersController.logout);
router.get("/me", usersController.getProfile);
router.patch("/me", usersController.updateProfile);
router.delete("/me", usersController.deleteProfile);

export default router;
