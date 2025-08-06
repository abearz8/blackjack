"use client";

// Import React components and utilities
import Chip from "../components/Chip";
import Card from "../components/Card";
import CardBack from "../components/CardBack";
import * as globalState from "../utils/globalState";
import { dealRandomCard, resetDeck, calculateHandValue } from "../utils/cardDeck";
import { useState } from "react";
import React from "react"; // Added missing import for React

// Interface for betting chips that appear in the center betting area
interface BettingChip {
  id: string;
  value: number;
  displayText: string;
  color: string;
  x: number;
  y: number;
}

// Interface for tracking the current game state
interface GameState {
  playerHand: any[];
  dealerHand: any[];
  dealerHiddenCard: any | null;
  gameStarted: boolean;
}

export default function Home() {
  // State to force re-renders when money changes (since we use global state)
  const [moneyState, setMoneyState] = useState({
    totalMoney: globalState.getTotalMoney(),
    moneyWagered: globalState.getMoneyWagered()
  });

  // State for chips in the betting area (center of screen)
  const [bettingChips, setBettingChips] = useState<BettingChip[]>([]);

  // State to control visibility of UI elements (betting vs game)
  const [showBettingUI, setShowBettingUI] = useState(true);

  // State for blackjack game (cards, hands, game status)
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    dealerHiddenCard: null,
    gameStarted: false
  });

  // State for game outcomes (none, win, loss, blackjack)
  const [gameOutcome, setGameOutcome] = useState<'none' | 'win' | 'loss' | 'blackjack'>('none');

  // State to track if player has stood (can't hit anymore)
  const [playerStood, setPlayerStood] = useState(false);

  // State to track if player has busted (hand > 21)
  const [playerBusted, setPlayerBusted] = useState(false);

  // State to track if player has blackjack (hand = 21)
  const [playerBlackjack, setPlayerBlackjack] = useState(false);

  // State to track if player is broke (no money left)
  const [playerBroke, setPlayerBroke] = useState(false);

  // Function to refresh the display when global money state changes
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

  // Function to add chip to betting area with random positioning
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

  // Function to remove chip from betting area and reverse the betting effect
  const removeChipFromBettingArea = (chipId: string) => {
    const chipToRemove = bettingChips.find(chip => chip.id === chipId);
    if (chipToRemove) {
      // Reverse the betting effect - add money back to total, subtract from wagered
      globalState.subtractMoneyWagered(chipToRemove.value);
      globalState.addMoney(chipToRemove.value);
      refreshDisplay();
      
      // Remove from betting area
      setBettingChips(prev => prev.filter(chip => chip.id !== chipId));
    }
  };

  // Function to start the game - deal initial cards and hide betting UI
  const handleStartGame = () => {
    // Reset the deck for a new game
    resetDeck();
    
    // Deal initial cards: player gets 2, dealer gets 1 visible + 1 hidden
    const playerCard1 = dealRandomCard();
    const dealerCard1 = dealRandomCard();
    const playerCard2 = dealRandomCard();
    const dealerCard2 = dealRandomCard();
    
    // Set up initial game state
    setGameState({
      playerHand: [playerCard1, playerCard2],
      dealerHand: [dealerCard1],
      dealerHiddenCard: dealerCard2,
      gameStarted: true
    });
    
    setShowBettingUI(false); // Hide betting UI, show game UI
  };

  // Function to handle hit - deal a new card to the player
  const handleHit = () => {
    // Deal a new card to the player
    const newCard = dealRandomCard();
    
    // Add the new card to the player's hand
    setGameState(prevState => ({
      ...prevState,
      playerHand: [...prevState.playerHand, newCard]
    }));
  };

  // Function to handle stand - dealer plays out their hand
  const handleStand = () => {
    // Set player as stood (can't hit anymore)
    setPlayerStood(true);
    
    // First, flip the dealer's hidden card immediately
    let currentDealerHand = [...gameState.dealerHand];
    let currentDealerHiddenCard = gameState.dealerHiddenCard;
    
    // If there's a hidden card, add it to dealer's hand
    if (currentDealerHiddenCard) {
      currentDealerHand.push(currentDealerHiddenCard);
      currentDealerHiddenCard = null;
    }
    
    // Update game state to show flipped card
    setGameState(prevState => ({
      ...prevState,
      dealerHand: currentDealerHand,
      dealerHiddenCard: null
    }));
    
    // Start dealer hitting process with delays for suspense
    let dealerHand = [...currentDealerHand];
    let hitCount = 0;
    
    const dealerHit = () => {
      if (calculateHandValue(dealerHand) < 17) {
        // Dealer needs to hit (house rules: hit on < 17)
        setTimeout(() => {
          const newCard = dealRandomCard();
          dealerHand.push(newCard);
          
          // Update game state with new card
          setGameState(prevState => ({
            ...prevState,
            dealerHand: dealerHand,
            dealerHiddenCard: null
          }));
          
          hitCount++;
          dealerHit(); // Continue hitting if needed
        }, 1200); // 1.2 second delay between hits for suspense
      } else {
        // Dealer is done, determine winner after a delay
        setTimeout(() => {
          const dealerValue = calculateHandValue(dealerHand);
          const playerValue = calculateHandValue(gameState.playerHand);
          
          if (dealerValue > 21) {
            // Dealer busts, player wins
            handleWin();
          } else if (dealerValue >= playerValue) {
            // Dealer wins or ties
            handleLoss();
          } else {
            // Player wins
            handleWin();
          }
        }, 1500); // 1.5 second delay before showing result
      }
    };
    
    // Start the dealer hitting process
    dealerHit();
  };

  // Function to handle win (regular win, not blackjack)
  const handleWin = () => {
    setGameOutcome('win');
    // Add winnings to total money (wager * 2)
    globalState.addMoney(moneyState.moneyWagered * 2);
    refreshDisplay();
  };

  // Function to handle blackjack (natural 21)
  const handleBlackjack = () => {
    setGameOutcome('blackjack');
    // Add winnings to total money (wager * 2)
    globalState.addMoney(moneyState.moneyWagered * 2);
    refreshDisplay();
  };

  // Function to handle loss
  const handleLoss = () => {
    setGameOutcome('loss');
  };

  // Function to return to main screen and reset all game state
  const handleReturnToMain = () => {
    // Reset game state
    setGameState({
      playerHand: [],
      dealerHand: [],
      dealerHiddenCard: null,
      gameStarted: false
    });
    
    // Reset game outcome
    setGameOutcome('none');
    
    // Reset player stood state
    setPlayerStood(false);
    
    // Reset player busted state
    setPlayerBusted(false);
    
    // Reset player blackjack state
    setPlayerBlackjack(false);
    
    // Clear betting chips
    setBettingChips([]);
    
    // Reset money wagered
    globalState.resetMoneyWagered();
    
    // Show betting UI
    setShowBettingUI(true);
    
    // Refresh display
    refreshDisplay();
    
    // Check for broke condition after a short delay
    setTimeout(() => {
      if (moneyState.totalMoney === 0 && moneyState.moneyWagered === 0) {
        setPlayerBroke(true);
      }
    }, 3000); // 3 second delay to ensure main screen is fully loaded
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

  // Check for win/loss conditions when player hand changes
  React.useEffect(() => {
    if (gameState.gameStarted && gameState.playerHand.length > 0) {
      const playerHandValue = calculateHandValue(gameState.playerHand);
      
      if (playerHandValue === 21) {
        // Set blackjack state immediately
        setPlayerBlackjack(true);
        // Add delay before showing win popup
        setTimeout(() => {
          handleBlackjack();
        }, 1500); // 1.5 second delay
      } else if (playerHandValue > 21) {
        // Set busted state immediately
        setPlayerBusted(true);
        // Add delay before showing loss popup
        setTimeout(() => {
          handleLoss();
        }, 1500); // 1.5 second delay
      }
    }
  }, [gameState.playerHand]);

  // Check for broke condition when money state changes
  React.useEffect(() => {
    if (showBettingUI && moneyState.totalMoney === 0 && moneyState.moneyWagered === 0) {
      // Player is broke - this will trigger the broke popup
      console.log("Player is broke!");
      setPlayerBroke(true);
    }
  }, [moneyState.totalMoney, moneyState.moneyWagered, showBettingUI]);

  // Placeholder click handlers for chip betting - fill these out with your logic
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
      {/* Green felt table background */}
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

      {/* Money display labels at the top */}
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

      {/* Broke Popup - appears when player has no money */}
      {showBettingUI && playerBroke && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#2c3e50",
            padding: "4vw",
            borderRadius: "1vw",
            textAlign: "center",
            color: "white",
            boxShadow: "0 0 2vw rgba(0,0,0,0.5)"
          }}>
            <h1 style={{ fontSize: "2.5vw", marginBottom: "2vw" }}>Ha! You lost all your money.</h1>
            <h2 style={{ fontSize: "1.8vw", marginBottom: "3vw" }}>
              Good thing this is only a game and not real life...
            </h2>
            <h3 style={{ fontSize: "1.5vw", marginBottom: "3vw" }}>
              Reload your browser to reset ;)
            </h3>
          </div>
        </div>
      )}

      {/* Betting Area Chips (Center of Screen) - chips placed during betting */}
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

      {/* Start Button - only visible during betting phase */}
      {showBettingUI && (
        <div style={{
          position: "absolute",
          top: "75%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <button
            onClick={handleStartGame}
            disabled={bettingChips.length === 0 || moneyState.moneyWagered === 0}
            style={{
              padding: "1vw 2vw",
              fontSize: "1.5vw",
              fontWeight: "bold",
              backgroundColor: bettingChips.length === 0 || moneyState.moneyWagered === 0 ? "#cccccc" : "#27ae60",
              color: "#fff",
              border: "0.2vw solid #fff",
              borderRadius: "0.8vw",
              cursor: bettingChips.length === 0 || moneyState.moneyWagered === 0 ? "not-allowed" : "pointer",
              boxShadow: "0.1vw 0.1vw 0.4vw rgba(0,0,0,0.2)",
              transition: "all 0.2s ease",
              width: "28vw", // Span from 36% to 60% = 24% + some padding
              minWidth: "28vw",
              opacity: bettingChips.length === 0 || moneyState.moneyWagered === 0 ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (bettingChips.length > 0 && moneyState.moneyWagered > 0) {
                e.currentTarget.style.backgroundColor = "#2ecc71";
              }
            }}
            onMouseLeave={(e) => {
              if (bettingChips.length > 0 && moneyState.moneyWagered > 0) {
                e.currentTarget.style.backgroundColor = "#27ae60";
              }
            }}
          >
            Start
          </button>
        </div>
      )}

      {/* Game Display - only visible when game is active */}
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
              Dealer's Hand: {playerStood ? calculateHandValue([...gameState.dealerHand, gameState.dealerHiddenCard].filter(Boolean)) : calculateHandValue(gameState.dealerHand)}
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
              {gameState.dealerHiddenCard && !playerStood && (
                <div>
                  <CardBack />
                </div>
              )}
              {gameState.dealerHiddenCard && playerStood && (
                <div>
                  <Card
                    number={gameState.dealerHiddenCard.number}
                    suit={gameState.dealerHiddenCard.suit}
                  />
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

          {/* Game Action Buttons - Hit and Stand */}
          {gameState.gameStarted && gameOutcome === 'none' && (
            <div style={{
              position: "absolute",
              bottom: "8%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "2vw"
            }}>
              {!playerStood && !playerBusted && !playerBlackjack && (
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
              )}
              {!playerStood && !playerBusted && !playerBlackjack && (
                <button
                  onClick={handleStand}
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
              )}
            </div>
          )}

          {/* Win Popup */}
          {gameOutcome === 'win' && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: "#27ae60",
                padding: "4vw",
                borderRadius: "1vw",
                textAlign: "center",
                color: "white",
                boxShadow: "0 0 2vw rgba(0,0,0,0.5)"
              }}>
                <h1 style={{ fontSize: "3vw", marginBottom: "2vw" }}>You Won!</h1>
                <h2 style={{ fontSize: "2vw", marginBottom: "3vw" }}>
                  Winnings: ${moneyState.moneyWagered * 2}
                </h2>
                <button
                  onClick={handleReturnToMain}
                  style={{
                    padding: "1vw 3vw",
                    fontSize: "1.5vw",
                    fontWeight: "bold",
                    backgroundColor: "#fff",
                    color: "#27ae60",
                    border: "none",
                    borderRadius: "0.5vw",
                    cursor: "pointer",
                    boxShadow: "0 0.2vw 0.5vw rgba(0,0,0,0.2)"
                  }}
                >
                  Return
                </button>
              </div>
            </div>
          )}

          {/* Blackjack Popup */}
          {gameOutcome === 'blackjack' && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: "#27ae60",
                padding: "4vw",
                borderRadius: "1vw",
                textAlign: "center",
                color: "white",
                boxShadow: "0 0 2vw rgba(0,0,0,0.5)"
              }}>
                <h1 style={{ fontSize: "3vw", marginBottom: "2vw" }}>Blackjack!</h1>
                <h2 style={{ fontSize: "2vw", marginBottom: "3vw" }}>
                  Winnings: ${moneyState.moneyWagered * 2}
                </h2>
                <button
                  onClick={handleReturnToMain}
                  style={{
                    padding: "1vw 3vw",
                    fontSize: "1.5vw",
                    fontWeight: "bold",
                    backgroundColor: "#fff",
                    color: "#27ae60",
                    border: "none",
                    borderRadius: "0.5vw",
                    cursor: "pointer",
                    boxShadow: "0 0.2vw 0.5vw rgba(0,0,0,0.2)"
                  }}
                >
                  Return
                </button>
              </div>
            </div>
          )}

          {/* Loss Popup */}
          {gameOutcome === 'loss' && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: "#e74c3c",
                padding: "4vw",
                borderRadius: "1vw",
                textAlign: "center",
                color: "white",
                boxShadow: "0 0 2vw rgba(0,0,0,0.5)"
              }}>
                <h1 style={{ fontSize: "3vw", marginBottom: "3vw" }}>You Lost!</h1>
                <button
                  onClick={handleReturnToMain}
                  style={{
                    padding: "1vw 3vw",
                    fontSize: "1.5vw",
                    fontWeight: "bold",
                    backgroundColor: "#fff",
                    color: "#e74c3c",
                    border: "none",
                    borderRadius: "0.5vw",
                    cursor: "pointer",
                    boxShadow: "0 0.2vw 0.5vw rgba(0,0,0,0.2)"
                  }}
                >
                  Return
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Chips - betting chips at the bottom of the screen */}
      {showBettingUI && (
        <div>
          <Chip 
            value={1} 
            displayText="1" 
            color={moneyState.totalMoney >= 1 ? "#e74c3c" : "#cccccc"} 
            x={36} 
            y={85} 
            onClick={moneyState.totalMoney >= 1 ? handleChip1Click : undefined} 
          />
          <Chip 
            value={5} 
            displayText="5" 
            color={moneyState.totalMoney >= 5 ? "#f1c40f" : "#cccccc"} 
            x={42} 
            y={85} 
            onClick={moneyState.totalMoney >= 5 ? handleChip5Click : undefined} 
          />
          <Chip 
            value={10} 
            displayText="10" 
            color={moneyState.totalMoney >= 10 ? "#2ecc71" : "#cccccc"} 
            x={48} 
            y={85} 
            onClick={moneyState.totalMoney >= 10 ? handleChip10Click : undefined} 
          />
          <Chip 
            value={25} 
            displayText="25" 
            color={moneyState.totalMoney >= 25 ? "#3498db" : "#cccccc"} 
            x={54} 
            y={85} 
            onClick={moneyState.totalMoney >= 25 ? handleChip25Click : undefined} 
          />
          <Chip 
            value={100} 
            displayText="100" 
            color={moneyState.totalMoney >= 100 ? "#2c3e50" : "#cccccc"} 
            x={60} 
            y={85} 
            onClick={moneyState.totalMoney >= 100 ? handleChip100Click : undefined} 
          />
        </div>
      )}
    </div>
  );
}
