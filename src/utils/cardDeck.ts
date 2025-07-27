import { CardType, Suit } from "../components/Card";

// Track which cards have been used (1-52)
let usedCards: number[] = [];

// Reset the deck
export const resetDeck = () => {
  usedCards = [];
};

// Generate a random card number (1-52) that hasn't been used
export const getRandomCardNumber = (): number => {
  const availableCards = Array.from({ length: 52 }, (_, i) => i + 1)
    .filter(num => !usedCards.includes(num));
  
  if (availableCards.length === 0) {
    resetDeck(); // Reset if all cards used
    return getRandomCardNumber();
  }
  
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  const cardNumber = availableCards[randomIndex];
  usedCards.push(cardNumber);
  return cardNumber;
};

// Convert card number (1-52) to suit and value
export const numberToCard = (cardNumber: number): CardType => {
  let suit: Suit;
  let number: number;
  
  if (cardNumber <= 13) {
    suit = Suit.Hearts;
    number = cardNumber;
  } else if (cardNumber <= 26) {
    suit = Suit.Diamonds;
    number = cardNumber - 13;
  } else if (cardNumber <= 39) {
    suit = Suit.Spades;
    number = cardNumber - 26;
  } else {
    suit = Suit.Clubs;
    number = cardNumber - 39;
  }
  
  return { suit, number };
};

// Deal a random card
export const dealRandomCard = (): CardType => {
  const cardNumber = getRandomCardNumber();
  return numberToCard(cardNumber);
};

// Get remaining cards count
export const getRemainingCards = (): number => {
  return 52 - usedCards.length;
}; 

// Function to calculate hand value
export function calculateHandValue(cards: CardType[]): number {
  let total = 0;
  let aces = 0;

  // First pass: add up all non-ace cards
  for (const card of cards) {
    if (card.number === 1) {
      // Ace - count it later
      aces++;
    } else if (card.number >= 11) {
      // Face cards (J, Q, K) are worth 10
      total += 10;
    } else {
      // Number cards (2-10) are worth their face value
      total += card.number;
    }
  }

  // Second pass: add aces
  for (let i = 0; i < aces; i++) {
    if (total + 11 <= 21) {
      // Use Ace as 11 if it won't bust
      total += 11;
    } else {
      // Use Ace as 1
      total += 1;
    }
  }

  return total;
} 