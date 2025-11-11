import { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Context } from "./main.jsx";
import api from "../api/axios.js";

const App = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

  // Fetch current user once on mount
  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      try {
        // ✅ FIX: do not double-prefix /api/v1
        const res = await api.get("/user/patient/me");
        if (!ignore) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        }
      } catch {
        if (!ignore) {
          setIsAuthenticated(false);
          setUser({});
        }
      }
    };

    fetchUser();
    return () => { ignore = true; };
  }, [setIsAuthenticated, setUser]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
