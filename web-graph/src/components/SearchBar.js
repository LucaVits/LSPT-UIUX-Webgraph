import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(`${process.env.PUBLIC_URL}/json/items/item1.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (event) => {
    if (event.key === "Enter" && query) {
      const selected = data.find((item) =>
        item.title.toLowerCase() === query.toLowerCase()
      );
      if (selected) {
        navigate(`/${selected.id}`);
      }
    }
  };

  const handleInputChange = (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    // Filter results based on the title field
    if (searchValue) {
      const results = data.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleSelectResult = (result) => {
    setQuery(result.title);
    setFilteredResults([]);
    navigate(`/${result.id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "8vh"
      }}
    >
      <div style={{ position: "relative", width: "200px" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleSearch}
          placeholder="Search for a result"
          style={{
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
          }}
        />
        {filteredResults.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              listStyleType: "none",
              margin: 0,
              padding: 0,
              maxHeight: "150px",
              overflowY: "auto",
              zIndex: 1000,
            }}
          >
            {filteredResults.map((result) => (
              <li
                key={result.id}
                onClick={() => handleSelectResult(result)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {result.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
