import React from "react";

const createInfoBox = (title, singleLineText, multilineText) => {
  return (
    <div
      style={{
        position: "absolute",
        background: "white",
        border: "2px solid black",
        borderRadius: "10px",
        padding: "10px",
        width: "200px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          borderBottom: "1px solid black",
          paddingBottom: "5px",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "blue",
          fontSize: "14px",
          marginBottom: "10px",
        }}
      >
        {singleLineText}
      </div>
      <div
        style={{
          fontSize: "12px",
          textAlign: "left",
          lineHeight: "1.4",
        }}
      >
        {multilineText}
      </div>
    </div>
  );
};

export default createInfoBox;
