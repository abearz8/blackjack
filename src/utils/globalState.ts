// Global state for total money
let totalMoney = 1000; // Starting money
let moneyWagered = 0; // Money currently wagered

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

// Money wagered functions
export const getMoneyWagered = (): number => {
  return moneyWagered;
};

export const setMoneyWagered = (amount: number): void => {
  moneyWagered = amount;
};

export const addMoneyWagered = (amount: number): void => {
  moneyWagered += amount;
};

export const subtractMoneyWagered = (amount: number): void => {
  moneyWagered = Math.max(0, moneyWagered - amount);
};

export const resetMoneyWagered = (): void => {
  moneyWagered = 0;
}; 