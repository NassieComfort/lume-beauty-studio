import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  user?: mongoose.Types.ObjectId;

  service: mongoose.Types.ObjectId;

  appointmentDate: Date;
  startTime: string;
  endTime: string;

  price: number;
  depositAmount: number;

  paymentStatus: "pending" | "paid" | "failed" | "refunded";

  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "rescheduled"
    | "no-show";

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    depositAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "rescheduled",
        "no-show",
      ],
      default: "pending",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);