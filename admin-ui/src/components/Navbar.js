import React from "react";
import "../styling/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/add-user">Add User</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
