import { Router } from "express";

import BlockedSlot from "../models/BlockedSlot";
import AppError from "../utils/AppError";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

router.use(
  protect,
  adminOnly
);

// GET blocked slots
router.get(
  "/",
  async (_req, res, next) => {
    try {
      const slots =
        await BlockedSlot.find()
          .sort({
            date: 1,
            startTime: 1,
          });

      return res.json({
        success: true,
        data: slots,
      });
    } catch (error) {
      next(error);
    }
  }
);

// CREATE blocked slot
router.post(
  "/",
  async (req, res, next) => {
    try {
      const {
        date,
        startTime,
        endTime,
        reason,
      } = req.body;

      if (
        !date ||
        !startTime ||
        !endTime
      ) {
        return next(
          new AppError(
            "Date, start time and end time are required.",
            400
          )
        );
      }

      const slot =
        await BlockedSlot.create({
          date,
          startTime,
          endTime,
          reason:
            reason?.trim(),
        });

      return res.status(201).json({
        success: true,
        message:
          "Blocked slot created successfully.",
        data: slot,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE blocked slot
router.delete(
  "/:id",
  async (req, res, next) => {
    try {
      const slot =
        await BlockedSlot.findByIdAndDelete(
          req.params.id
        );

      if (!slot) {
        return next(
          new AppError(
            "Blocked slot not found.",
            404
          )
        );
      }

      return res.json({
        success: true,
        message:
          "Blocked slot removed successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;