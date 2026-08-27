import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  user?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  service: mongoose.Types.ObjectId;

  date: Date;
  startTime: string;
  endTime: string;

  servicePrice: number;
  depositAmount: number;
  remainingAmount: number;

  paymentStatus: "pending" | "partial" | "paid" | "failed";

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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

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

    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    date: {
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

    servicePrice: {
      type: Number,
      required: true,
    },

    depositAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "failed"],
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

appointmentSchema.index({
  date: 1,
  startTime: 1,
});

export default mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);