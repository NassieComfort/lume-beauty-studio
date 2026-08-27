import mongoose, { Document, Schema } from "mongoose";

export interface IBlockedSlot extends Document {
  date: Date;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const blockedSlotSchema = new Schema<IBlockedSlot>(
  {
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

    isActive: {
      type: Boolean,
      default: true,
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