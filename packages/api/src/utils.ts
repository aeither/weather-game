const { utils } = require("ethers");

export function formatTokenBalance(tokenBalance) {
  const formattedBalance = utils.formatUnits(tokenBalance, 18);
  return parseInt(formattedBalance).toFixed(0);
}