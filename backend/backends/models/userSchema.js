import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    // PLAIN TEXT as requested (no bcrypt, no pre-save hooks)
    password: { type: String, required: true, minlength: 3 },
    role: { type: String, enum: ["admin", "doctor", "patient", "user"], default: "user" },
  },
  { timestamps: true }
);

// plain text compare
userSchema.methods.comparePassword = async function (entered) {
  return (entered || "") === (this.password || "");
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || "change_this_secret",
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
export { User };
