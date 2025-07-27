"use client";

import React from "react";

interface ChipProps {
  value: number;
  displayText: string;
  color: string;
  x: number;
  y: number;
  size?: number;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({ 
  value, 
  displayText, 
  color, 
  x, 
  y, 
  size = 4, // Default to 8vw instead of 64px
  onClick
}) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}vw`,
      height: `${size}vw`,
      borderRadius: "50%",
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
      border: "3px solid #fff",
      fontWeight: 700,
      fontSize: `${size * 0.4}vw`, // Scale font size with chip size
      color: "#fff",
      userSelect: "none",
      cursor: "pointer",
      transition: "transform 0.1s ease",
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    {displayText}
  </div>
);

export default Chip; 