import { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";

const errorMiddleware: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
};

export default errorMiddleware;