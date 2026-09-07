import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import connectDB from "../config/db";
import User from "../models/User";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "nassiebcomfort@gmail.com";
    const previousEmail = "admin@lumebeautystudio.com";
    const password = "ChangeMe123!";
    const name = "Lume Admin";
    const phone = process.env.ADMIN_PHONE || "0000000000";

    const existingAdmin = await User.findOne({
      email: {
        $in: [email.toLowerCase(), previousEmail.toLowerCase()],
      },
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");

      if (existingAdmin.email === previousEmail.toLowerCase()) {
        existingAdmin.email = email.toLowerCase();
        await existingAdmin.save();
        console.log("Admin email updated successfully.");
      }

      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();

        console.log("Existing account promoted to admin.");
      }

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin account created successfully.");
    console.log("Email:", email);
    console.log("Password:", password);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();