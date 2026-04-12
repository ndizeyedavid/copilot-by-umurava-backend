import express, { type Router } from "express";
import { screeningController } from "../controllers/screening.controller";

const screeningRouter: Router = express.Router();

screeningRouter.get("/", screeningController.getAll);
screeningRouter.get("/job/:jobId", screeningController.getByJobId);
screeningRouter.get("/:screeningId", screeningController.getOne);
screeningRouter.post("/ai/:jobId", screeningController.runAiScreening);
screeningRouter.put("/:screeningId", screeningController.updateScreening);
screeningRouter.delete("/:screeningId", screeningController.deleteScreening);

export default screeningRouter;
