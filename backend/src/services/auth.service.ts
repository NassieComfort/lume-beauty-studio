import bcrypt from "bcrypt";
import crypto from "crypto";

import User from "../models/User";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone?: string
) => {
  if (!name || !email || !password) {
    throw new AppError(
      "Name, email and password are required.",
      400
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const existingUser =
    await User.findOne({
      email: normalizedEmail,
    });

  if (existingUser) {
    throw new AppError(
      "Email already registered.",
      400
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone?.trim(),
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
  if (!email || !password) {
    throw new AppError(
      "Email and password are required.",
      400
    );
  }

  const user =
    await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

  if (!user) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "This account has been deactivated.",
      403
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatches) {
    throw new AppError(
      "Invalid email or password.",
      401
    );
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

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  if (!currentPassword || !newPassword) {
    throw new AppError(
      "Current and new passwords are required.",
      400
    );
  }

  if (newPassword.length < 6) {
    throw new AppError(
      "New password must be at least 6 characters.",
      400
    );
  }

  const user =
    await User.findById(userId).select(
      "+password"
    );

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  const matches =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!matches) {
    throw new AppError(
      "Current password is incorrect.",
      401
    );
  }

  user.password =
    await bcrypt.hash(newPassword, 12);

  await user.save();

  return true;
};

export const changeEmail = async (
  userId: string,
  newEmail: string,
  password: string
) => {
  if (!newEmail || !password) {
    throw new AppError(
      "New email and password are required.",
      400
    );
  }

  const user =
    await User.findById(userId).select(
      "+password"
    );

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatches) {
    throw new AppError(
      "Password is incorrect.",
      401
    );
  }

  const normalizedEmail =
    newEmail.trim().toLowerCase();

  const existingUser =
    await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

  if (existingUser) {
    throw new AppError(
      "That email is already in use.",
      400
    );
  }

  user.email = normalizedEmail;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const updateAdminAccount = async (
  userId: string,
  currentPassword: string,
  email: string,
  newPassword?: string
) => {
  const user = await User.findById(userId).select("+password");

  if (!user || user.role !== "admin") {
    throw new AppError("Admin account not found.", 404);
  }

  if (newPassword) {
    if (!currentPassword) {
      throw new AppError(
        "Current password is required to change your password.",
        400
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      throw new AppError(
        "Current password is incorrect.",
        400
      );
    }

    if (newPassword.length < 6) {
      throw new AppError(
        "New password must be at least 6 characters.",
        400
      );
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      throw new AppError(
        "New password must be different from your current password.",
        400
      );
    }

    user.password = await bcrypt.hash(newPassword, 12);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== user.email) {
    const emailOwner = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (emailOwner) {
      throw new AppError("That email is already in use.", 400);
    }

    user.email = normalizedEmail;
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

// ======================================================
// PASSWORD RESET TOKEN
// ======================================================

export const createPasswordResetToken =
  async (email: string) => {
    const user =
      await User.findOne({
        email: email.trim().toLowerCase(),
      });

    /*
     * Do not reveal whether an email exists.
     */
    if (!user) {
      return null;
    }

    const rawToken =
      crypto.randomBytes(32).toString("hex");

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    user.passwordResetToken =
      hashedToken;

    user.passwordResetExpires =
      new Date(
        Date.now() + 15 * 60 * 1000
      );

    await user.save();

    return {
      user,
      rawToken,
    };
  };

export const resetPassword = async (
  rawToken: string,
  newPassword: string
) => {
  if (!rawToken || !newPassword) {
    throw new AppError(
      "Reset token and new password are required.",
      400
    );
  }

  if (newPassword.length < 6) {
    throw new AppError(
      "Password must be at least 6 characters.",
      400
    );
  }

  const hashedToken =
    crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

  const user =
    await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: new Date(),
      },
    }).select("+password");

  if (!user) {
    throw new AppError(
      "Password reset token is invalid or expired.",
      400
    );
  }

  user.password =
    await bcrypt.hash(
      newPassword,
      12
    );

  user.passwordResetToken =
    undefined;

  user.passwordResetExpires =
    undefined;

  await user.save();

  return true;
};