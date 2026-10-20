import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../modules/users/User.js";
import { UserModel } from "../modules/users/User.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
    tokenVersion: number;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthenticated. No token provided." });
    return;
  }

  const token: string | undefined = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthenticated. Token is missing." });
    return;
  }

  try {
    const secretKey: string = process.env.JWT_SECRET ?? "super-secret-key";
    
    const decoded = jwt.verify(token, secretKey) as unknown as { 
      userId: string; 
      role: UserRole;
      tokenVersion: number;
    };
    console.log("DECODE RESULT:", decoded);
    const user = await UserModel.findById(decoded.userId).select("+tokenVersion");
    
    if (!user) {
      res.status(401).json({ message: "User no longer exists." });
      return;
    }
    console.log(decoded.tokenVersion);
      if (user.tokenVersion !== decoded.tokenVersion) {
      res.status(401).json({ message: "Token has been revoked. Please log in again." });
      return;
    }

    req.user = decoded; 
    next();
  } catch (error) {
    res.status(403).json({ message: "Token is invalid or expired." });
    return;
  }
};