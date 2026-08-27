import mongoose, { Document, Schema } from "mongoose";

export interface IAvailability extends Document {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const availabilitySchema = new Schema<IAvailability>(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

availabilitySchema.index(
  { dayOfWeek: 1 },
  { unique: true }
);

export default mongoose.model<IAvailability>(
  "Availability",
  availabilitySchema
);