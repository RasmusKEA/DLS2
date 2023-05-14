import React, { useState } from "react";
import axios from "axios";
import "../styling/AddUser.css";

function AddUser() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/create-user",
        user
      );

      if (response.status === 201) {
        // User creation successful, do something
        console.log("User created successfully");
      } else {
        console.error("Error creating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }

    // Reset the form fields
    setUser({
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-user-form">
      <div className="form-row">
        <label>Username:</label>
        <input
          type="email"
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="add-user-button">
        Add user
      </button>
    </form>
  );
}

export default AddUser;
