import React, { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import InvoiceList from "./components/InvoiceList";

const App = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("mail");

    if (token) {
      localStorage.setItem("jwt", token);
      localStorage.setItem("email", email);
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

      if (response.data.valid) {
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
              <Route path="/" element={<ProductForm />} />
              <Route path="/invoices" element={<InvoiceList />} />
            </Routes>
          </div>
        </Router>
      )}
    </div>
  );
};

export default App;
