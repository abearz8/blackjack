"use client";

import Chip from "../components/Chip";
import * as globalState from "../utils/globalState";
import { useState } from "react";

interface BettingChip {
  id: string;
  value: number;
  displayText: string;
  color: string;
  x: number;
  y: number;
}

export default function Home() {
  // State to force re-renders when money changes
  const [moneyState, setMoneyState] = useState({
    totalMoney: globalState.getTotalMoney(),
    moneyWagered: globalState.getMoneyWagered()
  });

  // State for chips in the betting area (center of screen)
  const [bettingChips, setBettingChips] = useState<BettingChip[]>([]);

  // Function to refresh the display
  const refreshDisplay = () => {
    setMoneyState({
      totalMoney: globalState.getTotalMoney(),
      moneyWagered: globalState.getMoneyWagered()
    });
  };

  // Function to generate random position within center betting area
  const getRandomBettingPosition = () => {
    // Center area: 30% to 70% of screen width, 30% to 70% of screen height
    const x = 36 + Math.random() * 20; // 35% to 65%
    const y = 20 + Math.random() * 30; // 30% to 70%
    return { x, y };
  };

  // Function to add chip to betting area
  const addChipToBettingArea = (value: number, displayText: string, color: string) => {
    const position = getRandomBettingPosition();
    const newChip: BettingChip = {
      id: `${value}-${Date.now()}-${Math.random()}`,
      value,
      displayText,
      color,
      x: position.x,
      y: position.y
    };
    setBettingChips(prev => [...prev, newChip]);
  };

  // Function to remove chip from betting area
  const removeChipFromBettingArea = (chipId: string) => {
    const chipToRemove = bettingChips.find(chip => chip.id === chipId);
    if (chipToRemove) {
      // Reverse the betting effect
      globalState.subtractMoneyWagered(chipToRemove.value);
      globalState.addMoney(chipToRemove.value);
      refreshDisplay();
      
      // Remove from betting area
      setBettingChips(prev => prev.filter(chip => chip.id !== chipId));
    }
  };

  // Placeholder click handlers - fill these out with your logic
  const handleChip1Click = () => {
    if(globalState.getTotalMoney() >= 1) {
      globalState.addMoneyWagered(1);
      globalState.subtractMoney(1);
      addChipToBettingArea(1, "1", "#e74c3c");
      refreshDisplay(); // Refresh the display
    }
  };

  const handleChip5Click = () => {
    if(globalState.getTotalMoney() >= 5) {
      globalState.addMoneyWagered(5);
      globalState.subtractMoney(5);
      addChipToBettingArea(5, "5", "#f1c40f");
      refreshDisplay(); // Refresh the display
    }
  };

  const handleChip10Click = () => {
    if(globalState.getTotalMoney() >= 10) {
      globalState.addMoneyWagered(10);
      globalState.subtractMoney(10);
      addChipToBettingArea(10, "10", "#2ecc71");
      refreshDisplay(); // Refresh the display
    }
  };

  const handleChip25Click = () => {
    if(globalState.getTotalMoney() >= 25) {
      globalState.addMoneyWagered(25);
      globalState.subtractMoney(25);
      addChipToBettingArea(25, "25", "#3498db");
      refreshDisplay(); // Refresh the display
    }
  };

  const handleChip100Click = () => {
    if(globalState.getTotalMoney() >= 100) {
      globalState.addMoneyWagered(100);
      globalState.subtractMoney(100);
      addChipToBettingArea(100, "100", "#2c3e50");
      refreshDisplay(); // Refresh the display
    }
  };

  return (
    <div>
      {/* Change Background to green */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#35654d",
        zIndex: -1
      }}>
      </div>

      {/* Labels */}
      <div>
        <div style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px"
        }}>
          <h1>Total Money: {moneyState.totalMoney}</h1>
          <h2 style={{ marginTop: "-15px" }}>Money Wagered: {moneyState.moneyWagered}</h2>
        </div>
      </div>

      {/* Betting Area Chips (Center of Screen) */}
      <div>
        {bettingChips.map((chip) => (
          <Chip
            key={chip.id}
            value={chip.value}
            displayText={chip.displayText}
            color={chip.color}
            x={chip.x}
            y={chip.y}
            size={6} // Slightly larger than bottom chips
            onClick={() => removeChipFromBettingArea(chip.id)}
          />
        ))}
      </div>

      {/* Start Button */}
      <div style={{
        position: "absolute",
        top: "75%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}>
        <button
          onClick={() => {
            
          }}
          style={{
            padding: "1vw 2vw",
            fontSize: "1.5vw",
            fontWeight: "bold",
            backgroundColor: "#27ae60",
            color: "#fff",
            border: "0.2vw solid #fff",
            borderRadius: "0.8vw",
            cursor: "pointer",
            boxShadow: "0.1vw 0.1vw 0.4vw rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
            width: "28vw", // Span from 36% to 60% = 24% + some padding
            minWidth: "28vw",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2ecc71";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#27ae60";
          }}
        >
          Start
        </button>
      </div>

      {/* Bottom Chips */}
      <div>
        <Chip value={1} displayText="1" color="#e74c3c" x={36} y={85} onClick={handleChip1Click} visible={true} />
        <Chip value={5} displayText="5" color="#f1c40f" x={42} y={85} onClick={handleChip5Click} visible={true} />
        <Chip value={10} displayText="10" color="#2ecc71" x={48} y={85} onClick={handleChip10Click} visible={true} />
        <Chip value={25} displayText="25" color="#3498db" x={54} y={85} onClick={handleChip25Click} visible={true} />
        <Chip value={100} displayText="100" color="#2c3e50" x={60} y={85} onClick={handleChip100Click} visible={true} />
      </div>
    </div>
  );
}
