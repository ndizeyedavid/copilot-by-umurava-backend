import Router from "express";
import healthRouter from "./health.route";
import jobsRouter from "./jobs.route";
import talentRouter from "./talents.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/jobs", jobsRouter);
router.use("/talents", talentRouter);

export default router;
