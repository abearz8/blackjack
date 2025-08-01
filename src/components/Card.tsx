"use client";

import React from "react";

// Card types and enums
export enum Suit {
  Diamonds = "diamonds",
  Clubs = "clubs",
  Spades = "spades",
  Hearts = "hearts",
}

export interface CardType {
  number: number; 
  suit: Suit;
}

interface CardProps extends CardType {
  x?: number;
  y?: number;
}

function getCardLabel(number: number) {
  if (number === 1) return "A";
  if (number === 11) return "J";
  if (number === 12) return "Q";
  if (number === 13) return "K";
  return number.toString();
}

function getSuitSymbol(suit: Suit) {
  switch (suit) {
    case Suit.Diamonds:
      return "♦";
    case Suit.Clubs:
      return "♣";
    case Suit.Spades:
      return "♠";
    case Suit.Hearts:
      return "♥";
  }
}

const CARD_WIDTH = 160;
const CARD_HEIGHT = 240;

const Card: React.FC<CardProps> = ({ number, suit, x, y }) => (
  <div
    style={{
      position: "relative",
      width: "6vw",
      height: "9vw",
      border: "1px solid #333",
      borderRadius: "0.4vw",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.4vw",
      color: suit === Suit.Hearts || suit === Suit.Diamonds ? "#d00" : "#222",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    }}
  >
    {/* Top left number */}
    <div
      style={{
        position: "absolute",
        top: "0.3vw",
        left: "0.3vw",
        fontSize: "0.9vw",
      }}
    >
      {getCardLabel(number)}
    </div>
    {/* Center suit */}
    <div style={{ fontSize: "3vw" }}>{getSuitSymbol(suit)}</div>
    {/* Bottom right number */}
    <div
      style={{
        position: "absolute",
        bottom: "0.3vw",
        right: "0.3vw",
        fontSize: "0.9vw",
      }}
    >
      {getCardLabel(number)}
    </div>
  </div>
);

export default Card; 