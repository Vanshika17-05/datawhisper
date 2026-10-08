import { Router } from "express";
import { dataRouter } from "./data.routes.js";
import { queryRouter } from "./query.routes.js";
import { historyRouter } from "./history.routes.js";
import { authRouter } from "./auth.routes.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const apiRouter = Router();
apiRouter.get("/health", (req, res) => res.json({ status: "ok", service: "datawhisper-api", timestamp: new Date().toISOString() }));
apiRouter.use("/auth", authRouter);
apiRouter.use("/data", requireAuth, dataRouter);
apiRouter.use("/query", requireAuth, queryRouter);
apiRouter.use("/history", requireAuth, historyRouter);
