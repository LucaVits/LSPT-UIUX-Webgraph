import React from 'react';
import Logo from './Images/RPI_logo.png';
const RPILogo = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "30vh",
          marginBottom: "20px"
        }}
      >
        <img 
          src={Logo} 
          alt="RPI logo" 
          style={{ maxWidth: "100%", height: "auto" }} 
        />
      </div>
    );
  };
  
  export default RPILogo;
  