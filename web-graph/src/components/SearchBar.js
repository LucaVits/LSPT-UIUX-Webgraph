import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GraphPage from "./GraphPage";
import axios from 'axios';



const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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

  function handleSearch() {
    const url = 'http://lspt-link-analysis.cs.rpi.edu:1234/uiux/graph';
  
    // Make API call
    axios.get(url)
      .then((response) => {
        const jsonData = response.data;
  
        // Store the data in localStorage or pass it to another function/file
        localStorage.setItem('graphData', JSON.stringify(jsonData));
  
        // Optionally, you can update the DOM or trigger another action to display it
        console.log('JSON file downloaded and saved to localStorage:', jsonData);
        
        // Call a function to display this data
        GraphPage(jsonData);
      })
      .catch((error) => {
        console.error('Error during the request:', error.message);
      });
  }

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
          height: "8vh",
          marginBottom: "20px"
        }}
      >
        <div style={{ position: "relative", width: "600px" }}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleSearch}
            placeholder="Search for a result"
            style={{
              width: "100%",
              padding: "16px",
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
  