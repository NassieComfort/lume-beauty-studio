import bcrypt from "bcrypt";
import User from "../models/User";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const updateAdminAccount = async (
  userId: string,
  currentPassword: string,
  email: string,
  newPassword?: string
) => {
  const user = await User.findById(userId);

  if (!user || user.role !== "admin") {
    throw new AppError("Admin account not found", 404);
  }

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new AppError("Current password is incorrect", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailOwner = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: user._id },
  });

  if (emailOwner) {
    throw new AppError("That email is already in use", 400);
  }

  user.email = normalizedEmail;

  if (newPassword) {
    user.password = await bcrypt.hash(newPassword, 12);
  }

  await user.save();

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};