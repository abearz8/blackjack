// Global state for total money
let totalMoney = 1000; // Starting money

export const getTotalMoney = (): number => {
  return totalMoney;
};

export const setTotalMoney = (amount: number): void => {
  totalMoney = amount;
};

export const addMoney = (amount: number): void => {
  totalMoney += amount;
};

export const subtractMoney = (amount: number): void => {
  totalMoney = Math.max(0, totalMoney - amount); // Prevent negative money
};

export const resetMoney = (): void => {
  totalMoney = 1000; // Reset to starting amount
}; 