import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB connected");

    const email = "nassiebcomfort@gmail.com";

    // Choose your new password here.
    // Do NOT send this password to me.
    const password = "Newpassword123!";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("An account with this email already exists.");
      await mongoose.disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: "Lume Admin",
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully!");
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    });

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

createAdmin();