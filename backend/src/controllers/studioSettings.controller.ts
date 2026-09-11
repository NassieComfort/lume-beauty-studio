import {
  Request,
  Response,
  NextFunction,
} from "express";

import StudioSettings from "../models/StudioSettings";

export const getStudioSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let settings = await StudioSettings.findOne();

    // Create the settings document if it does not exist yet
    if (!settings) {
      settings = await StudioSettings.create({
        studioName: "Lume Beauty Studio",
        email: process.env.ADMIN_EMAIL || "",
        phone: "",
        address: "",
        depositPercentage: 30,
        latenessGracePeriod: 30,
        cancellationNoticeHours: 24,
        latenessFee: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get studio settings error:", error);
    next(error);
  }
};

export const updateStudioSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      studioName,
      email,
      phone,
      address,
      depositPercentage,
      latenessGracePeriod,
      cancellationNoticeHours,
      latenessFee,
    } = req.body;

    if (!studioName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Studio name is required.",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Contact email is required.",
      });
    }

    const settings = await StudioSettings.findOneAndUpdate(
      {},
      {
        $set: {
          studioName: studioName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || "",
          address: address?.trim() || "",
          depositPercentage:
            depositPercentage ?? 30,
          latenessGracePeriod:
            latenessGracePeriod ?? 30,
          cancellationNoticeHours:
            cancellationNoticeHours ?? 24,
          latenessFee: latenessFee ?? 0,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Studio settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Update studio settings error:", error);
    next(error);
  }
};