// backends/scripts/seedAdmin.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 1) Load environment variables
dotenv.config({ path: "./config/config.env" });

// 2) Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || process.env.DB_URL;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in config/config.env");
  process.exit(1);
}

await mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("✅ Connected to MongoDB");

// 3) Define a minimal User schema (must match your real model)
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, lowercase: true },
  phone: String,
  nic: String,
  dob: Date,
  gender: { type: String, enum: ["Male", "Female"] },
  password: String,
  role: { type: String, enum: ["Patient", "Doctor", "Admin"], default: "Patient" },
});

const User = mongoose.model("User", userSchema, "users"); // existing collection name

// 4) Seed the admin
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "moatazkamal777@gmail.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Feizo Kamal111";

try {
  const existingAdmin = await User.findOne({ role: "Admin" });
  if (existingAdmin) {
    console.log(`ℹ️ Admin already exists: ${existingAdmin.email}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await User.create({
    firstName: "Zee",
    lastName: "Admin",
    email: ADMIN_EMAIL,
    phone: "01000000000",
    nic: "00000000000000",
    dob: new Date("1990-01-01"),
    gender: "Male",
    password: hashed,
    role: "Admin",
  });

  console.log("✅ Seeded Admin:");
  console.log(`   Email   : ${admin.email}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
} catch (err) {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
} finally {
  await mongoose.disconnect();
  process.exit(0);
}
