"use client";

import Chip from "../components/Chip";
import Card from "../components/Card";
import CardBack from "../components/CardBack";
import * as globalState from "../utils/globalState";
import { dealRandomCard, resetDeck, calculateHandValue } from "../utils/cardDeck";
import { useState } from "react";

interface BettingChip {
  id: string;
  value: number;
  displayText: string;
  color: string;
  x: number;
  y: number;
}

interface GameState {
  playerHand: any[];
  dealerHand: any[];
  dealerHiddenCard: any | null;
  gameStarted: boolean;
}

export default function Home() {
  // State to force re-renders when money changes
  const [moneyState, setMoneyState] = useState({
    totalMoney: globalState.getTotalMoney(),
    moneyWagered: globalState.getMoneyWagered()
  });

  // State for chips in the betting area (center of screen)
  const [bettingChips, setBettingChips] = useState<BettingChip[]>([]);

  // State to control visibility of UI elements
  const [showBettingUI, setShowBettingUI] = useState(true);

  // State for blackjack game
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    dealerHiddenCard: null,
    gameStarted: false
  });

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

  // Function to start the game
  const handleStartGame = () => {
    // Reset the deck
    resetDeck();
    
    // Deal initial cards
    const playerCard1 = dealRandomCard();
    const dealerCard1 = dealRandomCard();
    const playerCard2 = dealRandomCard();
    const dealerCard2 = dealRandomCard();
    
    setGameState({
      playerHand: [playerCard1, playerCard2],
      dealerHand: [dealerCard1],
      dealerHiddenCard: dealerCard2,
      gameStarted: true
    });
    
    setShowBettingUI(false); // Hide betting UI
  };

  // Function to handle hit
  const handleHit = () => {
    // Deal a new card to the player
    const newCard = dealRandomCard();
    
    // Add the new card to the player's hand
    setGameState(prevState => ({
      ...prevState,
      playerHand: [...prevState.playerHand, newCard]
    }));
  };

  // Function to calculate card positions for centering
  const getCardPositions = (numCards: number) => {
    const cardWidth = 6; // 6vw card width
    const gap = 1; // 1vw gap between cards
    const totalWidth = (numCards * cardWidth) + ((numCards - 1) * gap);
    
    // Center within the container div (which is 80% of screen width)
    const startX = 50 - (totalWidth / 2); // Center around 50% of container
    
    return Array.from({ length: numCards }, (_, index) => {
      const x = startX + (index * (cardWidth + gap));
      return x;
    });
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
      {showBettingUI && (
        <div>
          {bettingChips.map((chip) => (
            <Chip
              key={chip.id}
              value={chip.value}
              displayText={chip.displayText}
              color={chip.color}
              x={chip.x}
              y={chip.y}
              size={6} // Larger size for betting chips
              onClick={() => removeChipFromBettingArea(chip.id)}
            />
          ))}
        </div>
      )}

      {/* Start Button */}
      {showBettingUI && (
        <div style={{
          position: "absolute",
          top: "75%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <button
            onClick={handleStartGame}
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
      )}

      {/* Game Display */}
      {gameState.gameStarted && (
        <div>
          {/* Dealer's Hand Container */}
          <div style={{
            position: "absolute",
            top: "25%",
            left: "10%",
            width: "80%",
            height: "20%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start"
          }}>
            <h3 style={{ color: "white", marginBottom: "1vw", fontSize: "1.2vw", marginTop: "0" }}>
              Dealer's Hand: {calculateHandValue(gameState.dealerHand)}
            </h3>
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1vw"
            }}>
              {gameState.dealerHand.map((card, index) => (
                <div key={`dealer-${index}`}>
                  <Card
                    number={card.number}
                    suit={card.suit}
                  />
                </div>
              ))}
              {gameState.dealerHiddenCard && (
                <div>
                  <CardBack />
                </div>
              )}
            </div>
          </div>

          {/* Player's Hand Container */}
          <div style={{
            position: "absolute",
            bottom: "28%",
            left: "10%",
            width: "80%",
            height: "20%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start"
          }}>
            <h3 style={{ color: "white", marginBottom: "1vw", fontSize: "1.2vw", marginTop: "0" }}>
              Your Hand: {calculateHandValue(gameState.playerHand)}
            </h3>
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1vw"
            }}>
              {gameState.playerHand.map((card, index) => (
                <div key={`player-${index}`}>
                  <Card
                    number={card.number}
                    suit={card.suit}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Game Action Buttons */}
          {gameState.gameStarted && (
            <div style={{
              position: "absolute",
              bottom: "8%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "2vw"
            }}>
              <button
                onClick={handleHit}
                style={{
                  padding: "1vw 2vw",
                  fontSize: "1.2vw",
                  fontWeight: "bold",
                  backgroundColor: "#27ae60",
                  color: "#fff",
                  border: "0.2vw solid #fff",
                  borderRadius: "0.6vw",
                  cursor: "pointer",
                  boxShadow: "0.1vw 0.1vw 0.4vw rgba(0,0,0,0.2)",
                  transition: "all 0.2s ease",
                  minWidth: "8vw",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2ecc71";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#27ae60";
                }}
              >
                Hit
              </button>
              <button
                onClick={() => {
                  // TODO: Add stand functionality
                  console.log("Stand button clicked");
                }}
                style={{
                  padding: "1vw 2vw",
                  fontSize: "1.2vw",
                  fontWeight: "bold",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "0.2vw solid #fff",
                  borderRadius: "0.6vw",
                  cursor: "pointer",
                  boxShadow: "0.1vw 0.1vw 0.4vw rgba(0,0,0,0.2)",
                  transition: "all 0.2s ease",
                  minWidth: "8vw",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c0392b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#e74c3c";
                }}
              >
                Stand
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Chips */}
      {showBettingUI && (
        <div>
          <Chip value={1} displayText="1" color="#e74c3c" x={36} y={85} onClick={handleChip1Click} visible={true} />
          <Chip value={5} displayText="5" color="#f1c40f" x={42} y={85} onClick={handleChip5Click} visible={true} />
          <Chip value={10} displayText="10" color="#2ecc71" x={48} y={85} onClick={handleChip10Click} visible={true} />
          <Chip value={25} displayText="25" color="#3498db" x={54} y={85} onClick={handleChip25Click} visible={true} />
          <Chip value={100} displayText="100" color="#2c3e50" x={60} y={85} onClick={handleChip100Click} visible={true} />
        </div>
      )}
    </div>
  );
}
