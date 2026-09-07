import { RequestHandler } from "express";
import AppError from "../utils/AppError";

const adminOnly: RequestHandler = (req, _res, next) => {
  if (!req.user?.id) {
    return next(new AppError("Authentication required", 401));
  }

  if (req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }

  return next();
};

export default adminOnly;