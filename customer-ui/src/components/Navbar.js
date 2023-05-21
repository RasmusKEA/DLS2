import React from "react";
import "../styling/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="/">Create invoice</a>
        </li>
        <li>
          <a href="/invoices">See invoices</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
