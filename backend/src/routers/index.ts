import Router from "express";
import healthRouter from "./health.route";
import jobsRouter from "./jobs.route";
import talentRouter from "./talents.route";
import screeningRouter from "./screening.route";
import applicationRouter from "./application.route";
import emailRouter from "./email.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import externalScreeningRouter from "./external-screening.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/jobs", jobsRouter);
router.use("/talents", talentRouter);
router.use("/screening", screeningRouter);
router.use("/applications", applicationRouter);
router.use("/email", emailRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/external-screening", externalScreeningRouter);

export default router;
