import React from "react";
import "../styling/Buttons.css";

function Buttons({ onAddUser, onDeleteUser }) {
  return (
    <div className="user-list-buttons">
      <button className="delete-button" onClick={onDeleteUser}>
        Delete user
      </button>
    </div>
  );
}

export default Buttons;
