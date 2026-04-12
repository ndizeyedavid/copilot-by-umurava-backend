import express, { type Router } from "express";
import { talentController } from "../controllers/talents.controller";

const talentRouter: Router = express.Router();

talentRouter.get("/", talentController.getAll);
talentRouter.get("/:id", talentController.getById);
talentRouter.get("/", talentController.getByName); // not complete
talentRouter.post("/", talentController.createTalent);
talentRouter.put("/:talentId", talentController.updateTalent);
talentRouter.delete("/:talentId", talentController.deleteTalent);

export default talentRouter;
