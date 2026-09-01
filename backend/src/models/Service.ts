import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  category: "Lashes" | "Nails" | "Brows" | "Waxing";
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Lashes", "Nails", "Brows", "Waxing"],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 15,
    },

    image: {
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

const Service = mongoose.model<IService>("Service", serviceSchema);

export default Service;