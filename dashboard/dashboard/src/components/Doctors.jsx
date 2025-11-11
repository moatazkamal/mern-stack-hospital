import axios from "axios";
import { useContext, useState , useEffect } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import api from "../api/axios.js";



const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => {
            return (
              <div className="card" key={element._id || `${element.email}-${element.nic}`}>
                <h4>{`${element.firstName || ""} ${element.lastName || ""}`}</h4>
                <div className="details">
                  <p>
                    Email: <span>{element.email || "N/A"}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone || "N/A"}</span>
                  </p>
                  <p>
                    DOB:{" "}
                    <span>
                      {element.dob
                        ? element.dob.substring(0, 10)
                        : "Not Provided"}
                    </span>
                  </p>
                  <p>
                    Department: <span>{element.doctorDepartment || "N/A"}</span>
                  </p>
                  <p>
                    NIC: <span>{element.nic || "N/A"}</span>
                  </p>
                  <p>
                    Gender: <span>{element.gender || "N/A"}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;

