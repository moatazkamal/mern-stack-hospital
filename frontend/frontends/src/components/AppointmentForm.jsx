// frontend/src/pages/AppointmentForm.jsx
import  { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios.js";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [nic,       setNic]       = useState("");
  const [dob,       setDob]       = useState("");
  const [gender,    setGender]    = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName,  setDoctorLastName]  = useState("");
  const [address,    setAddress]    = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [doctors,    setDoctors]    = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const departmentsArray = [
    "Biology", "Pediatrics", "Orthopedics", "Cardiology", "Neurology",
    "Oncology", "Radiology", "Physical Therapy", "Dermatology", "ENT",
  ];

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/user/doctors");
        setDoctors(data.doctors || []);
      } catch {
        toast.error("Failed to load doctors");
      }
    })();
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();

    // simple client-side validation to avoid round trips
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender) {
      return toast.error("Please fill all personal details.");
    }
    if (!appointmentDate || !department) {
      return toast.error("Please select department and appointment date.");
    }
    if (!doctorFirstName || !doctorLastName) {
      return toast.error("Please choose a doctor.");
    }
    if (!address) {
      return toast.error("Please enter your address.");
    }

    try {
      setSubmitting(true);
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob, // backend expects Date; your schema validates Date type
        gender,
        appointment_date: appointmentDate, // backend expects string key
        department,
        doctor_firstName: doctorFirstName,
        doctor_lastName: doctorLastName,
        hasVisited,
        address,
      };

      const { data } = await api.post("/appointment/post", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(data?.message || "Appointment sent successfully!");

      // reset fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("Pediatrics");
      setDoctorFirstName("");
      setDoctorLastName("");
      setAddress("");
      setHasVisited(false);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to send appointment";
      toast.error(msg);
      console.error("POST /appointment/post error:", error?.response?.data || error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input type="text" placeholder="First Name" value={firstName}
                 onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" value={lastName}
                 onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div>
          <input type="email" placeholder="Email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="Mobile Number" value={phone}
                 onChange={(e) => setPhone(e.target.value)} required />
        </div>

        <div>
          <input type="text" placeholder="NIC" value={nic}
                 onChange={(e) => setNic(e.target.value)} required />
          <input type="date" placeholder="Date of Birth" value={dob}
                 onChange={(e) => setDob(e.target.value)} required />
        </div>

        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input type="date" placeholder="Appointment Date" value={appointmentDate}
                 onChange={(e) => setAppointmentDate(e.target.value)} required />
        </div>

        <div>
          <select value={department}
                  onChange={(e) => { setDepartment(e.target.value); setDoctorFirstName(""); setDoctorLastName(""); }}
                  required>
            {departmentsArray.map((depart, i) => (
              <option value={depart} key={i}>{depart}</option>
            ))}
          </select>

          <select
            value={`${doctorFirstName} ${doctorLastName}`.trim()}
            onChange={(e) => {
              // safer split (supports multi-part names)
              const parts = e.target.value.split(" ");
              const first = parts.shift() || "";
              const last  = parts.join(" ");
              setDoctorFirstName(first);
              setDoctorLastName(last);
            }}
            required
          >
            <option value="">Select Doctor</option>
            {doctors
              .filter((d) => d.doctorDepartment === department)
              .map((doctor, i) => (
                <option value={`${doctor.firstName} ${doctor.lastName}`} key={i}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
          </select>
        </div>

        <textarea rows="5" value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address" required />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p style={{ marginBottom: 0 }}>Visited before?</p>
          <input type="checkbox" checked={hasVisited}
                 onChange={(e) => setHasVisited(e.target.checked)} />
        </div>

        <button type="submit" disabled={submitting} style={{ margin: "0 auto" }}>
          {submitting ? "Submitting..." : "GET APPOINTMENT"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
