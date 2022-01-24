import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import listsController from "../controllers/lists.controller";

const router: Router = Router();

router.get("/", auth, listsController.getLists);
router.get("/:id", auth, listsController.getList);
router.post("/", auth, listsController.createList);
router.patch("/:id", auth, listsController.updateList);
router.delete("/:id", auth, listsController.deleteList);

export default router;
