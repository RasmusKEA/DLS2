import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import DeleteButton from "../components/DeleteButton";
import "../App.css"; // Import the CSS file for App component

function Home() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true); // Set loading to true before making the request
      const response = await axios.get("http://localhost:8080/users");
      const fetchedUsers = response.data.hits.hits.map((hit) => ({
        id: hit._id,
        ...hit._source,
      }));

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setTimeout(() => {
        setLoading(false); // Set loading to false after the delay
      }, 500); // Set loading to false after the request is completed
    }
  };

  const handleSearch = (query) => {
    if (users) {
      const filtered = users.filter(
        (user) =>
          user.email && user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleCheckboxChange = (userId) => {
    const updatedSelectedUserIds = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId];
    setSelectedUserIds(updatedSelectedUserIds);
  };

  const handleDeleteUser = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await axios.delete("http://localhost:8080/remove-user", {
        data: { userIds: selectedUserIds },
      });

      if (response.status === 200) {
        // Refresh the user list after successful deletion
        fetchUsers();

        // Clear the selected user IDs
        setSelectedUserIds([]);
      } else {
        console.error("Error deleting users:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }

    // Hide the delete confirmation dialog
    setShowDeleteConfirmation(false);
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div style={{ height: "400px", overflow: "auto" }}>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <UserList
            users={filteredUsers.length > 0 ? filteredUsers : users}
            selectedUserIds={selectedUserIds}
            onCheckboxChange={handleCheckboxChange}
          />
        )}
      </div>
      <DeleteButton onDeleteUser={handleDeleteUser} />
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete these users?</p>
          <div>
            <button onClick={confirmDeleteUser}>Confirm</button>
            <button onClick={cancelDeleteUser}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
