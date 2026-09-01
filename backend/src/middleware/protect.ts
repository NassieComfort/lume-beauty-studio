import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

interface JwtPayload {
  id: string;
  email: string;
  role: "customer" | "admin";
}

const protect: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};

export default protect;