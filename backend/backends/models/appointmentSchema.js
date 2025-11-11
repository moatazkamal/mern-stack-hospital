import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 3 },
    lastName:  { type: String, required: true, minlength: 3 },
    email:     { type: String, required: true, validate: [validator.isEmail, "Please provide a valid email!"] },
    phone:     { type: String, required: true, minlength: 11, maxlength: 11 },
    nic:       { type: String, required: true, minlength: 13, maxlength: 13 },
    dob:       { type: Date, required: true },
    gender:    { type: String, required: true, enum: ["Male", "Female"] },

    appointment_date: { type: String, required: true }, // kept as string for your UI
    department:       { type: String, required: true },

    doctor: {
      firstName: { type: String, required: true },
      lastName:  { type: String, required: true },
    },

    hasVisited: { type: Boolean, default: false },

    doctorId:  { type: mongoose.Schema.ObjectId, required: true },
    patientId: { type: mongoose.Schema.ObjectId, required: true },

    address: { type: String, required: true },

    status:  { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
