import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import GraphPage from "./components/GraphPage";

const App = () => {
  return (
    <Router>
      <div>
        <h1>WebGraph Example</h1>
        {/* Search bar component */}
        <SearchBar />
        
        {/* Define Routes */}
        <Routes>
          {}
          <Route path="/" element={<p>Please search for a graph.</p>} />
          
          {}
          <Route path="/:name" element={<GraphPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
