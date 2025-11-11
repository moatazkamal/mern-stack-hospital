import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import User from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName, lastName, email, phone, nic, dob, gender,
    appointment_date, department, doctor_firstName, doctor_lastName,
    hasVisited, address,
  } = req.body;

  if (
    !firstName || !lastName || !email || !phone || !nic || !dob ||
    !gender || !appointment_date || !department ||
    !doctor_firstName || !doctor_lastName || !address
  ) {
    return next(new ErrorHandler("Please fill all required fields!", 400));
  }

  if (!req.user?.id || req.user.role !== "patient") {
    return next(new ErrorHandler("Not Authenticated as patient", 401));
  }

  const doctor = await User.findOne({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "doctor",
    doctorDepartment: department,
  });
  if (!doctor) return next(new ErrorHandler("Doctor not found! Check name & department.", 404));

  const appointment = await Appointment.create({
    firstName, lastName, email, phone, nic, dob, gender,
    appointment_date, department,
    doctor: { firstName: doctor_firstName, lastName: doctor_lastName },
    hasVisited: !!hasVisited,
    address,
    doctorId: doctor._id,
    patientId: req.user.id,
  });

  res.status(201).json({ success: true, message: "Appointment sent successfully!", appointment });
});

export const getAllAppointments = catchAsyncErrors(async (_req, res) => {
  const appointments = await Appointment.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: appointments.length, appointments });
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appt = await Appointment.findById(id);
  if (!appt) return next(new ErrorHandler("Appointment Not Found!", 404));

  const updated = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: "Appointment Status Updated!", appointment: updated });
});

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appt = await Appointment.findById(id);
  if (!appt) return next(new ErrorHandler("Appointment Not Found!", 404));
  await appt.deleteOne();
  res.status(200).json({ success: true, message: "Appointment Deleted!" });
});
