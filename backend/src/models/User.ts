import mongoose, {
  Document,
  Schema,
} from "mongoose";

export type UserRole =
  | "customer"
  | "admin";

export interface IUser
  extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  isActive: boolean;

  passwordResetToken?: string;
  passwordResetExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema =
  new Schema<IUser>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        trim: true,
      },

      password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
      },

      role: {
        type: String,
        enum: [
          "customer",
          "admin",
        ],
        default: "customer",
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      passwordResetToken: {
        type: String,
        select: false,
      },

      passwordResetExpires: {
        type: Date,
        select: false,
      },
    },
    {
      timestamps: true,
    }
  );

const User =
  mongoose.model<IUser>(
    "User",
    userSchema
  );

export default User;