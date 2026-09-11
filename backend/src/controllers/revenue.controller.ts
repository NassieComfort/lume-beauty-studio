import {
  Request,
  Response,
  NextFunction,
} from "express";

import Appointment from "../models/Appointment";

export const getRevenue =
  async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointments =
        await Appointment.find();

      let totalBookingValue = 0;
      let paidAmount = 0;
      let outstandingAmount = 0;
      let completedRevenue = 0;

      for (const appointment of appointments) {
        totalBookingValue +=
          appointment.price;

        if (
          appointment.paymentStatus ===
          "paid"
        ) {
          paidAmount +=
            appointment.depositAmount;
        }

        const balance =
          appointment.price -
          appointment.depositAmount;

        if (
          appointment.paymentStatus !==
            "paid" &&
          appointment.status !==
            "cancelled"
        ) {
          outstandingAmount +=
            balance;
        }

        if (
          appointment.status ===
            "completed" &&
          appointment.paymentStatus ===
            "paid"
        ) {
          completedRevenue +=
            appointment.price;
        }
      }

      return res.json({
        success: true,

        data: {
          totalBookingValue,
          paidAmount,
          outstandingAmount,
          completedRevenue,
        },
      });
    } catch (error) {
      next(error);
    }
  };