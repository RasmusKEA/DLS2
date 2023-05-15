import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddUser from "./pages/AddUser";
import "./App.css"; // Import the CSS file for App component
import Home from "./pages/Home";
import axios from "axios";
import jwt_decode from "jwt-decode";

function App() {
  const [isTokenValid, setIsTokenValid] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      verifyToken(token);
    } else {
      const storedToken = localStorage.getItem("jwt");
      if (storedToken) {
        verifyToken(storedToken);
      } else {
        // Handle the case when the token is not present
      }
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.post("http://localhost:8080/verify-auth", {
        token,
        secret: "rasmus-secret",
      });
      let decoded = jwt_decode(token);
      console.log(decoded.roles);

      if (response.data.valid && decoded.roles[1] === "admin") {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
        console.error("Token verification failed");
      }
    } catch (error) {
      setIsTokenValid(false);
      console.error("Token verification failed:", error);
    }
  };

  return (
    <div>
      {!isTokenValid ? (
        <div>
          <p>Invalid token. Please authenticate.</p>
        </div>
      ) : (
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-user" element={<AddUser />} />
            </Routes>
          </div>
        </Router>
      )}
    </div>
  );
}

export default App;
