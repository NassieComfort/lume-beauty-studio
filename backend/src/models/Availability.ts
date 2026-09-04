import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IAvailability
  extends Document {
  dayOfWeek: number;
  isOpen: boolean;
  openingTime?: string;
  closingTime?: string;
}

const availabilitySchema =
  new Schema<IAvailability>(
    {
      dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
        unique: true,
      },

      isOpen: {
        type: Boolean,
        default: true,
      },

      openingTime: {
        type: String,
        required: function () {
          return this.isOpen;
        },
      },

      closingTime: {
        type: String,
        required: function () {
          return this.isOpen;
        },
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IAvailability>(
  "Availability",
  availabilitySchema
);