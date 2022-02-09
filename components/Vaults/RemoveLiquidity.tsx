import React, { useReducer, useState, useEffect } from "react";

import BigNumber from "bignumber.js";
import { Position } from '@uniswap/v3-sdk'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'

import Account from "../Account";

import { isNaN, compare } from "../../utils/number";

import styles from "./Vaults.module.css";

type Status = "success" | "noAmount" | "insufficientBalance" | "loading";

const errorMsg = {
  success: "Remove Liquidity",
  noAmount: "Enter an amount",
  insufficientBalance: "Insufficient balance",
  loading: "Remove Liquidity",
};

const ActionButton = ({
  status,
  onAction,
}: {
  status: Status;
  onAction: Function;
}) =>
  status === "success" ? (
    <button className={styles["vaults-button"]} onClick={(e) => onAction()}>
      {errorMsg[status]}
    </button>
  ) : (
      <div className={styles["vaults-button-error"]}>{errorMsg[status]}</div>
    );

const RemoveLiquidity = ({
  library,
  state,
  onConnectWallet,
  onRemoveLiquidity,
  status,
  pool,
  poolTick,
  priceRange,
  serviceFee,
  tokenId       // NFT Position TokenId
}) => {
  const [amount, setAmount] = useState("");

  const [error, setError] = useState<Status>("success");

  const [cellarInfo, setCellarInfo] = useState({
    balance: new BigNumber(0),
    totalSupply: new BigNumber(0),
    liquidity0: new BigNumber(0),
    liquidity1: new BigNumber(0)
  });

  const [receivedAmount, setReceivedAmount] = useState({
    token0: new BigNumber(0),
    token1: new BigNumber(0)
  })

  useEffect(() => {
    const init = async () => {
      console.log(library.methods.cellarWethUsdt);
      const balance = await library.methods.cellarWethUsdt.getBalance(state.account.address);
      const totalSupply = await library.methods.cellarWethUsdt.totalSupply();

      if (tokenId !== 0 && pool) {
        const { tickLower, tickUpper, liquidity } = await library.methods.nftPositionManager.getPositionByTokenId(tokenId)
        console.log(tickLower, tickUpper, liquidity)

        const positionSDK = new Position({
          pool,
          liquidity: liquidity.toString(),
          tickLower: Number(tickLower),
          tickUpper: Number(tickUpper),
        })

        console.log(positionSDK)

        const liquidityPercentage = new Percent(100, 100)

        const discountedAmount0 = positionSDK
          ? liquidityPercentage.multiply(positionSDK.amount0.quotient).quotient
          : undefined
        const discountedAmount1 = positionSDK
          ? liquidityPercentage.multiply(positionSDK.amount1.quotient).quotient
          : undefined

        const liquidityValue0 = CurrencyAmount.fromRawAmount(pool.token0, discountedAmount0)
        const liquidityValue1 = CurrencyAmount.fromRawAmount(pool.token1, discountedAmount1)

        console.log('========================================')
        console.log(liquidityValue0.toSignificant(), liquidityValue1.toSignificant())

        setCellarInfo({
          balance: new BigNumber(balance),
          totalSupply: new BigNumber(totalSupply),
          liquidity0: new BigNumber(liquidityValue0.toSignificant()),
          liquidity1: new BigNumber(liquidityValue1.toSignificant())
        })
      }
    };

    if (state.account.address && library) {
      init();
    }
  }, [library, state.account.address, tokenId, pool]);

  const handleInputRemovePercentage = (value) => {
    if (isNaN(value)) {
      value = 0;
    }

    if (compare(100, value) === -1 ) {
      value = 100;
    }

    setAmount(value)
  }

  useEffect(() => {
    if (isNaN(amount)) {
      return
    }

    if (compare(amount, 0) <= 0) {
      return
    }

    const percentage = new BigNumber(amount).dividedBy(100).multipliedBy(cellarInfo.balance).dividedBy(cellarInfo.totalSupply)
    
    const token0Amount = new BigNumber(cellarInfo.liquidity0).multipliedBy(percentage)
    const token1Amount = new BigNumber(cellarInfo.liquidity1).multipliedBy(percentage)

    console.log(token1Amount.toFixed(2), token0Amount.toFixed(2))

    setReceivedAmount({
      token0: token0Amount,
      token1: token1Amount
    })
  }, [amount, cellarInfo])

  const handleRemoveLiquidity = () => {
    const removeAmount = Number(amount) < 100 ? new BigNumber(amount).dividedBy(100).multipliedBy(cellarInfo.balance).toFixed(0) : cellarInfo.balance
    onRemoveLiquidity(removeAmount)
  }

  return (
    <div className={styles["vaults-content"]}>
      <span className={styles["vaults-content-subtitle"]}>
        Amount to Remove
      </span>
      <div className={styles["vaults-content-input-box"]}>
        <input
          type="text"
          value={amount}
          onChange={(e) => handleInputRemovePercentage(e.target.value)}
          className={styles["vaults-remove-amount-input"]}
        />
        <span className={styles["vaults-remove-amount-percent"]}>%</span>
      </div>
      <div className={styles["vaults-row3"]}>
        <span className={styles["vaults-content-subtitle"]}>
          You will Receive
        </span>
        <div className={styles["vaults-row-arrow"]}>
          <img src="/assets/arrow-down.png" />
        </div>
      </div>
      <div className={styles["vaults-row2"]}>
        <div className={styles["vaults-receive"]}>
          <div className={styles["vaults-receive-icon"]}>
            <img src="/assets/tokens/weth.svg" />
          </div>
          <div className={styles["vaults-receive-value"]}>{receivedAmount.token0.toFixed(4)}</div>
        </div>
        <div className={styles["vaults-receive"]}>
          <div className={styles["vaults-receive-icon"]}>
            <img src="/assets/tokens/usdt.svg" />
          </div>
          <div className={styles["vaults-receive-value"]}>{receivedAmount.token1.toFixed(4)}</div>
        </div>
      </div>
      <div className={styles["vaults-row3"]}>
        {state.account.address ? (
          <ActionButton status={error} onAction={() => handleRemoveLiquidity()} />
        ) : (
          <Account
            library={library}
            className="white-full-width"
            {...state}
            connectWallet={() => onConnectWallet(true)}
          />
        )}
      </div>
    </div>
  );
};

export default RemoveLiquidity;
