import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const readToken = (req) => {
  if (req.cookies?.token) return req.cookies.token;        // cookie
  const h = req.headers.authorization || "";               // Bearer
  if (h.startsWith("Bearer ")) return h.slice(7);
  return null;
};

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const token = readToken(req);
    if (!token) return res.status(401).json({ success: false, message: "Not Authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");
    const user = await User.findById(decoded.id).select("_id role");
    if (!user) return res.status(401).json({ success: false, message: "Invalid token user" });

    req.user = { id: user._id, role: user.role };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Not Authenticated" });
  }
};

export const isAdminAuthenticated = (req, res, next) =>
  isAuthenticatedUser(req, res, () => {
    if (req.user?.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin access only" });
    next();
  });

export const isPatientAuthenticated = (req, res, next) =>
  isAuthenticatedUser(req, res, () => {
    if (req.user?.role !== "patient")
      return res.status(403).json({ success: false, message: "Patient access only" });
    next();
  });
