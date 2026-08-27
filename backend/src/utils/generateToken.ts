import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  role: "customer" | "admin";
}

const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });
};

export default generateToken;