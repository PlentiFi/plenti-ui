import BigNumber from "bignumber.js";

export type TMap = {
  [key: string]: any
}

export interface FormatValue {
  format: string
  value: BigNumber,
}
