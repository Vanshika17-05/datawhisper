import { Router } from "express";
import { dataRouter } from "./data.routes.js";
import { queryRouter } from "./query.routes.js";
import { historyRouter } from "./history.routes.js";

export const apiRouter = Router();
apiRouter.get("/health", (req, res) => res.json({ status: "ok", service: "datawhisper-api", timestamp: new Date().toISOString() }));
apiRouter.use("/data", dataRouter);
apiRouter.use("/query", queryRouter);
apiRouter.use("/history", historyRouter);
