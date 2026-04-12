import express, { type Router } from "express";
import { talentController } from "../controllers/talents.controller";

const talentRouter: Router = express.Router();

talentRouter.get("/", talentController.getAll);
talentRouter.get("/:id", talentController.getById);
talentRouter.get("/", talentController.getByName);
talentRouter.post("/", talentController.createTalent);

export default talentRouter;
