import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import GraphPage from "./components/GraphPage";
import RPILogo from "./components/Logo"

const App = () => {
  return (
    <Router>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center-align both the logo and search bar
        }}
      >
        {/* Logo */}
        <RPILogo />
        {/* Search Bar */}
        <SearchBar />
        {/* Routes */}
        <Routes>
          <Route path="/" element={<p>Please search for a graph.</p>} />
          <Route path="/:name" element={<GraphPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

