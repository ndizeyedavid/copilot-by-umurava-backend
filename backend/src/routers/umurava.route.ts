import express, { type Router } from "express";
import { umuravaController } from "../controllers/umurava.controller";

const umuravaRouter: Router = express.Router();

umuravaRouter.get("/talents/dummy", umuravaController.getDummyTalents);

export default umuravaRouter;
