import React, { useState, useEffect } from "react";
import "../styling/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() === "") {
      onSearch(""); // Search with empty query to display all users
    } else {
      onSearch(query);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || query === "") {
      handleSearch();
    }
  };

  const handleBlur = () => {
    if (query === "") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (query === "") {
      handleSearch();
    }
  }, [query]);

  return (
    <div className="search-bar-container">
      <input
        className="search-bar-input"
        type="text"
        placeholder="Search by email"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <button className="search-bar-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
