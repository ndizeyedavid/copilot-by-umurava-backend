import express from "express";
// @ts-ignore
import cors from "cors";
import helmet from "helmet";
// @ts-ignore
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
// @ts-ignore
import swaggerDocument from "./swagger-output.json";

import dbConnect from "./config/dbConnect";
import router from "./routers";

const app = express();
dbConnect();

// middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// routers
app.use("/api/v1", router);

// API Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app };
