import type { HydratedDocument } from "mongoose";
import type { JwtPayload, UserDocument } from "./domain.js";

declare global {
  namespace Express {
    interface Request {
      user: HydratedDocument<UserDocument>;
      auth?: JwtPayload;
    }
  }
}

export {};
