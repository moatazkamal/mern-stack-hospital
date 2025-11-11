import mongoose from "mongoose";

export const dbConnection = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL;
  if (!uri) {
    console.error("[DB] Missing MONGO_URI/MONGO_URL in .env");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      dbName: "MERN_STACK_HOSPITAL_MANAGMENT_SYSTEM",
      serverSelectionTimeoutMS: 8000,
    });
    const { name, host } = conn.connection;
    console.log(`[DB] Connected -> db="${name}" host="${host}"`);
  } catch (err) {
    console.error("[DB] Connection error:", err.message);
    process.exit(1);
  }
};
