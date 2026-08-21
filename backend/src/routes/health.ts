import { Router, Request, Response } from "express";

const router = Router();

// GET /api/health — simple check that the API and server are alive
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Lume Beauty Studio API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
