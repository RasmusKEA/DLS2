import React, { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import axios from "axios";

const App = () => {
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
        <div>
          <h1>Product Form</h1>
          <ProductForm />
        </div>
      )}
    </div>
  );
};

export default App;
