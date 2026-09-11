import mongoose, { Document, Schema } from "mongoose";

export interface IStudioSettings extends Document {
  studioName: string;
  email: string;
  phone?: string;
  address?: string;

  depositPercentage: number;
  latenessGracePeriod: number;
  cancellationNoticeHours: number;

  latenessFee: number;

  createdAt: Date;
  updatedAt: Date;
}

const studioSettingsSchema = new Schema<IStudioSettings>(
  {
    studioName: {
      type: String,
      required: true,
      trim: true,
      default: "Lume Beauty Studio",
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    depositPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 30,
    },

    latenessGracePeriod: {
      type: Number,
      min: 0,
      default: 30,
    },

    cancellationNoticeHours: {
      type: Number,
      min: 0,
      default: 24,
    },

    latenessFee: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStudioSettings>(
  "StudioSettings",
  studioSettingsSchema
);