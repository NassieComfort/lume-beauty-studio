import { ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export default errorMiddleware;