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
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing";
import ENV from "./config/env";

const app = express();
dbConnect();

// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// routers
app.use("/api/v1", router);
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: ENV.uploadthing_token,
    },
  }),
);

// API Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app };
