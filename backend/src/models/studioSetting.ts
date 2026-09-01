import mongoose, { Document, Schema } from "mongoose";

export interface IStudioSettings extends Document {
  depositPercentage: number;
  latenessGracePeriod: number;
  latenessFee: number;
  bufferTime: number;
}

const studioSettingsSchema = new Schema<IStudioSettings>(
  {
    depositPercentage: {
      type: Number,
      default: 30,
      min: 0,
      max: 100,
    },

    latenessGracePeriod: {
      type: Number,
      default: 30,
    },

    latenessFee: {
      type: Number,
      default: 20000,
    },

    bufferTime: {
      type: Number,
      default: 15,
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