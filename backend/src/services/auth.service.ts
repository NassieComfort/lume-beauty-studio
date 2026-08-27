import bcrypt from "bcryptjs";

import User, { IUser } from "../models/User";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";

interface RegisterInput {
    name: string; 
    email: string;
    password: string;
}

interface LoginInput { 
    email: string;
    password: string;
}

export const registerUser = async (input: RegisterInput) => {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
        throw new AppError("Email already exists", 400);
    }

    const user = await User.create(input);
    const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    return { token, user: sanitizerUser(user) };
};

export const loginUser = async (input: LoginInput) => {
    const user = await User.findOne({ email: input.email });
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return { token, user: sanitizerUser(user) };
};

const sanitizerUser = (user: IUser) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
});