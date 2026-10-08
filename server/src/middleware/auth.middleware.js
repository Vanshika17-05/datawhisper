import { User } from "../models/User.js";
import { verifyToken } from "../services/auth.service.js";

function unauthorized(message = "Authentication required") {
  const error = new Error(message);
  error.status = 401;
  return error;
}

export async function requireAuth(req, res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) throw unauthorized();

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw unauthorized("Account not found");

    req.user = user;
    next();
  } catch (error) {
    next(error.status ? error : unauthorized("Invalid or expired token"));
  }
}
