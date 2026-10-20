import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../modules/users/User.js";

// Extend Express Request interface to include the decoded user payload
export interface CustomRequest extends Request {
  user?: { userId: string; role: UserRole };
}

// Middleware to verify the JWT token (Authentication)
export const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const secret = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

    // FIX: Convert to 'unknown' first to safely cast the JWT payload
    const decoded = jwt.verify(token, secret) as unknown as {
      userId: string;
      role: UserRole;
    };

    // Attach user payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Middleware to restrict access based on roles (Authorization)
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "Forbidden. You do not have the required permissions.",
        });
    }
    next();
  };
};
