import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

import BigNumber from "bignumber.js";

import { CurrencyAmount } from "@uniswap/sdk-core";
import { Position } from "@uniswap/v3-sdk";
import { FormatValue } from "../../types";

import DepositAmountInput from "../DepositAmountInput";
import PriceRange from "../PriceRange";
import Account from "../Account";
import TooltipIcon from "../TooltipIcon";
import VaultItem from "../VaultItem";

import { isNaN, compare } from "../../utils/number";
import { runningStatus } from "../../utils/constants";

import cn from "classname";
import styles from "./Vaults.module.css";

type Status = "success" | "noAmount" | "insufficientBalance" | "loading";

const errorMsg = {
  success: "Add Liquidity",
  noAmount: "Enter an amount",
  insufficientBalance: "Insufficient balance",
  loading: "Add Liquidity",
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

const AddLiquidity = ({
  onSelectVault,
  onAddLiquidity,
  library,
  state,
  onConnectWallet,
  status,
  pool,
  poolTick,
  priceRange,
  serviceFee,
}) => {
  const [depositAmountOne, setDepositAmountOne] = useState<FormatValue>({
    value: new BigNumber(0),
    format: "0",
  });
  const [depositAmountTwo, setDepositAmountTwo] = useState<FormatValue>({
    value: new BigNumber(0),
    format: "0",
  });

  const [balanceOne, setBalanceOne] = useState(0);
  const [balanceTwo, setBalanceTwo] = useState(0);

  const [error, setError] = useState<Status>("success");

  const [priceShowType, setPriceShowType] = useState(0);

  const initBalance = async () => {
    console.log(state.account.address, library);
    const ethBalance = await library.web3.eth.getBalance(state.account.address);
    const usdtBalance = await library.methods
      .Market(library.addresses.USDT_TOKEN)
      .getBalance(state.account.address);

    setBalanceOne(ethBalance);
    setBalanceTwo(usdtBalance);
  };

  // tokenNum: 0 or 1 => token0 or token1
  const handleUpdateInputAmount = (amount, tokenNum) => {
    if (!(state.account.address && library)) {
      return;
    }

    if (isNaN(amount)) {
      amount = 0;
    }

    if (tokenNum === 0) {
      const decimals = pool.token0.decimals;
      const decimals2 = pool.token1.decimals;

      const val = {
        format: amount === 0 ? "" : amount,
        value: new BigNumber(amount).multipliedBy(10 ** decimals),
      };

      const position = Position.fromAmount0({
        pool: pool,
        tickLower: Number(poolTick.tickLower),
        tickUpper: Number(poolTick.tickUpper),
        amount0: new BigNumber(amount).multipliedBy(10 ** decimals).toNumber(),
        useFullPrecision: true, // we want full precision for the theoretical position
      });

      const price = new BigNumber(CurrencyAmount.fromRawAmount(
        pool.token1,
        position.amount1.quotient
      ).toSignificant()).multipliedBy(1).toString(10);

      const val2 = {
        format: price,
        value: new BigNumber(price).multipliedBy(10 ** decimals2),
      };

      setDepositAmountOne(val);
      setDepositAmountTwo(val2);
    }

    if (tokenNum === 1) {
      const decimals = pool.token0.decimals;
      const decimals2 = pool.token1.decimals;

      const val = {
        format: amount === 0 ? "" : amount,
        value: new BigNumber(amount).multipliedBy(10 ** decimals2),
      };

      const position = Position.fromAmount1({
        pool: pool,
        tickLower: Number(poolTick.tickLower),
        tickUpper: Number(poolTick.tickUpper),
        amount1: new BigNumber(amount).multipliedBy(10 ** decimals2).toNumber(),
      });

      const price = new BigNumber(CurrencyAmount.fromRawAmount(
        pool.token0,
        position.amount0.quotient
      ).toSignificant()).multipliedBy(1.001).toString(10);

      const val2 = {
        format: price,
        value: new BigNumber(price).multipliedBy(10 ** decimals),
      };

      setDepositAmountOne(val2);
      setDepositAmountTwo(val);
    }
  };

  useEffect(() => {
    if (status === runningStatus.STATUS_LOADING) {
      setError("loading");
    }
    if (status === runningStatus.STATUS_IDLE) {
      setError("success");
    }
  }, [status]);

  useEffect(() => {
    console.log("libarary", library);
    if (state.account.address && library) {
      initBalance();
    }
  }, [library, state.account.address]);

  useEffect(() => {
    if (isNaN(depositAmountOne.value) || isNaN(depositAmountTwo.value)) {
      setError("noAmount");
      return;
    }

    if (
      compare(depositAmountOne.value, 0) <= 0 ||
      compare(depositAmountTwo.value, 0) <= 0
    ) {
      setError("noAmount");
      return;
    }

    if (
      compare(depositAmountOne.value, balanceOne) > 0 ||
      compare(depositAmountTwo.value, balanceTwo) > 0
    ) {
      setError("insufficientBalance");
      return;
    }

    setError("success");
  }, [depositAmountOne, depositAmountTwo, balanceOne, balanceTwo]);

  const handleAddLiquidity = () => {
    onAddLiquidity(depositAmountOne, depositAmountTwo);
  };

  return (
    <div className={styles["vaults-content"]}>
      <span className={styles["vaults-content-subtitle"]}>Select a Sommelier Vault</span>

      <div className={styles["vaults-row"]}>
        <VaultItem 
          name={'ETH-USDT'}
          fee={0.05}
          badges={["ETHEREUM", "UNISWAP V3"]}
          onSelectVault={() => onSelectVault()} 
          hover={true}
        />
      </div>

      <div className={styles["vaults-row"]}>
        <div className={cn(styles["vaults-row-value"], styles.apy)}>
          <span className={styles.percent}>671%</span>
          <span className={styles.value}>APY</span>
          <TooltipIcon icon={faQuestionCircle} placement="top">
            <span style={{ padding: "9px 15px" }}>
              This APY is based on
              <br /> the last 90 days of data, compounded monthly
            </span>
          </TooltipIcon>
        </div>
      </div>

      <span className={styles["vaults-content-subtitle"]}>Deposit Amounts</span>
      <div className={styles["vaults-row"]}>
        <DepositAmountInput
          token="eth"
          decimals={18}
          inputValue={depositAmountOne.format}
          balance={balanceOne}
          onChange={(value) => {
            handleUpdateInputAmount(value, 0);
          }}
          onClickMax={(e) => {
            handleUpdateInputAmount(
              new BigNumber(balanceOne).dividedBy(10 ** 18),
              0
            );
          }}
        />
      </div>
      <div className={styles["vaults-row"]}>
        <DepositAmountInput
          token="usdt"
          decimals={6}
          inputValue={depositAmountTwo.format}
          balance={balanceTwo}
          onChange={(value) => {
            handleUpdateInputAmount(value, 1);
          }}
          onClickMax={(e) => {
            handleUpdateInputAmount(
              new BigNumber(balanceTwo).dividedBy(10 ** 6),
              1
            );
          }}
        />
      </div>
      <div className={styles["vaults-row"]}>
        <span
          className={styles["vaults-content-subtitle"]}
          style={{ paddingTop: 0 }}
        >
          Current Price Ranges
        </span>
        <span
          className={styles["vaults-content-text-btn"]}
          onClick={(e) => setPriceShowType((priceShowType + 1) % 2)}
        >
          {priceShowType === 0 ? "ETH per USDT" : "USDT per ETH"}
        </span>
      </div>
      <div className={styles["vaults-row"]}>
        <PriceRange
          className={styles["vaults-row-price"]}
          title="min price"
          value={
            priceShowType === 0
              ? priceRange.min
              : new BigNumber(1)
                  .dividedBy(priceRange.max)
                  .toFixed(Number(priceRange.max) > 1 ? 4 : 2)
          }
          description={priceShowType === 1 ? "ETH per USDT" : "USDT per ETH"}
        />
        <PriceRange
          className={styles["vaults-row-price"]}
          title="max price"
          value={
            priceShowType === 0
              ? priceRange.max
              : new BigNumber(1)
                  .dividedBy(priceRange.min)
                  .toFixed(Number(priceRange.min) > 1 ? 4 : 2)
          }
          description={priceShowType === 1 ? "ETH per USDT" : "USDT per ETH"}
        />
      </div>
      <div className={styles["vaults-row"]}>
        <div className={styles["vaults-service-fee-panel"]}>
          <div className={styles.row}>
            <span>Service Fee:</span>
            <span>{serviceFee.service}% annual</span>
          </div>
          <div className={styles.row}>
            <span>Strategy Owner Fee:</span>
            <span>{serviceFee.owner}% monthly</span>
          </div>
          <div className={styles.row}>
            <span>Validator Fee:</span>
            <span>{serviceFee.validator}% annual</span>
          </div>
        </div>
      </div>
      <div className={styles["vaults-row"]}>
        {state.account.address ? (
          <ActionButton status={error} onAction={() => handleAddLiquidity()} />
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

export default AddLiquidity;
