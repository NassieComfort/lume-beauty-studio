import mongoose, { Document, Schema } from "mongoose";

export interface IBlockedSlot extends Document {
  date: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

const blockedSlotSchema = new Schema<IBlockedSlot>(
  {
    date: {
      type: String,
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

    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBlockedSlot>(
  "BlockedSlot",
  blockedSlotSchema
);