// backends/scripts/seedAdmin.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/userSchema.js";

// Use IPv4 localhost to avoid ::1 on Windows
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/MERN_STACK_HOSPITAL_MANAGMENT_SYSTEM";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
const ADMIN_FIRSTNAME = process.env.SEED_ADMIN_FIRSTNAME || "Admin";
const ADMIN_LASTNAME = process.env.SEED_ADMIN_LASTNAME || "User";

async function connectDB() {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("[seed] Connected:", MONGO_URI);
}

async function seedAdmin() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`[seed] ${ADMIN_EMAIL} exists → updating role/password (plain).`);
      existing.role = "admin";
      existing.password = ADMIN_PASSWORD; // plain text
      existing.firstName ||= ADMIN_FIRSTNAME;
      existing.lastName ||= ADMIN_LASTNAME;
      await existing.save();
      console.log("[seed] Existing admin updated.");
      process.exit(0);
    }

    await User.create({
      firstName: ADMIN_FIRSTNAME,
      lastName: ADMIN_LASTNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // plain text
      role: "admin",
    });

    console.log(`[seed] Created admin ${ADMIN_EMAIL} (plain password).`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedAdmin();
