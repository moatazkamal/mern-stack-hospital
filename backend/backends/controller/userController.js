import User from "../models/userSchema.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

const safeUser = (u) =>
  u && ({ id: u._id, firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role });

// POST /api/v1/user/login
export const login = catchAsyncErrors(async (req, res, next) => {
  const email = (req.body.email || "").toLowerCase().trim();
  const password = (req.body.password || "").trim();

  if (!email || !password)
    return next(new ErrorHandler("Please provide email and password", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("Invalid email or password", 401));

  const isMatch = await user.comparePassword(password); // plain-text compare
  if (!isMatch) return next(new ErrorHandler("Invalid email or password", 401));

  const token = user.getJwtToken();
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true on HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ success: true, message: "Login successful", token, user: safeUser(user) });
});

// POST /api/v1/user/patient/register
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return next(new ErrorHandler("All fields are required", 400));

  const normalizedEmail = (email || "").toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return next(new ErrorHandler("Email already registered", 409));

  const user = await User.create({
    firstName, lastName, email: normalizedEmail, password, role: "patient",
  });

  return res.status(201).json({ success: true, message: "Patient registered successfully", user: safeUser(user) });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  if (!req.user?.id) return next(new ErrorHandler("Not Authenticated", 401));
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("User not found", 404));
  return res.status(200).json({ success: true, user: safeUser(user) });
});

export const logoutAdmin = catchAsyncErrors(async (_req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Admin logged out" });
});

export const logoutPatient = catchAsyncErrors(async (_req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Patient logged out" });
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return next(new ErrorHandler("All fields are required", 400));

  const normalizedEmail = (email || "").toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return next(new ErrorHandler("Email already exists", 409));

  const admin = await User.create({
    firstName, lastName, email: normalizedEmail, password, role: "admin",
  });

  return res.status(201).json({ success: true, message: "Admin created successfully", user: safeUser(admin) });
});

export const getAllDoctors = catchAsyncErrors(async (_req, res) => {
  const doctors = await User.find({ role: "doctor" }).select("-password");
  return res.status(200).json({ success: true, doctors });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return next(new ErrorHandler("All fields are required", 400));

  const normalizedEmail = (email || "").toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return next(new ErrorHandler("Email already exists", 409));

  const doctor = await User.create({
    firstName, lastName, email: normalizedEmail, password, role: "doctor",
  });

  return res.status(201).json({ success: true, message: "Doctor created successfully", user: safeUser(doctor) });
});
