import React from "react";
import "../styling/UserList.css";

function UserList({ users, selectedUserIds, onCheckboxChange }) {
  const handleCheckboxChange = (userId) => {
    onCheckboxChange(userId);
  };

  return (
    <div className="user-list-container">
      <table className="user-list-table">
        <thead>
          <tr>
            <th className="checkbox-header"></th>
            <th>ID</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="checkbox-cell">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                  <span className="checkmark"></span>
                </label>
              </td>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
