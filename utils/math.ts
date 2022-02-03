import BigNumber from "bignumber.js";

export const getPriceFromTick = (tick, token0Decimals, token1Decimals) => {
  const BPS = 1.0001;

  const decimalDifference = tick > 0 ? token0Decimals - token1Decimals : token1Decimals - token0Decimals

  const price =  new BigNumber(BPS ** tick).dividedBy(
    10 ** decimalDifference
  )

  const result = tick > 0 ? new BigNumber(1).dividedBy(price) : price

  return result.toFixed(2);
};
