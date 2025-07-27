"use client";

import React from "react";

interface CardBackProps {
  x?: number;
  y?: number;
}

const CardBack: React.FC<CardBackProps> = ({ x, y }) => (
  <div
    style={{
      position: "relative",
      width: "6vw",
      height: "9vw",
      border: "1px solid #333",
      borderRadius: "0.4vw",
      background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: "80%",
        height: "80%",
        border: "2px solid #fff",
        borderRadius: "0.2vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "1vw",
        fontWeight: "bold",
      }}
    >
      ♠
    </div>
  </div>
);

export default CardBack; 