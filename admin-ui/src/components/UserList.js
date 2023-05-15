import React from "react";
import "../styling/UserList.css";

function truncateId(id) {
  const truncatedLength = 7; // Adjust the desired length
  if (id.length <= truncatedLength) {
    return id;
  }
  return id.substring(0, truncatedLength) + "...";
}

function UserList({ users, selectedUserIds, onCheckboxChange }) {
  const handleCheckboxChange = (userId, idOkta) => {
    onCheckboxChange(userId, idOkta);
  };

  return (
    <div className="user-list-container">
      <table className="user-list-table">
        <thead>
          <tr>
            <th className="checkbox-header"></th>
            <th>ID</th>
            <th>OktaID</th>
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
                    onChange={() => handleCheckboxChange(user.id, user.idOkta)}
                  />
                  <span className="checkmark"></span>
                </label>
              </td>
              <td title={user.id}>{truncateId(user.id)}</td>
              <td title={user.idOkta}>{truncateId(user.idOkta)}</td>
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
