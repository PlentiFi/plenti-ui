import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

import BigNumber from "bignumber.js";

import { Price, Token } from "@uniswap/sdk-core";
import {
  FeeAmount,
  Pool,
  Position,
  priceToClosestTick,
  tickToPrice,
  TickMath,
} from "@uniswap/v3-sdk";
import { FormatValue } from "../../types";

import DepositAmountInput from "../DepositAmountInput";
import PriceRange from "../PriceRange";
import Account from "../Account";
import TooltipIcon from "../TooltipIcon";

import { isNaN, compare, convertWeiToValue } from "../../utils/number";
import { runningStatus } from "../../utils/constants";
import { getUniswapV3PoolOverview } from "../../utils/uniswap-v3";
import { getPriceFromTick } from "../../utils/math";

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
}) => {
  const [depositAmountOne, setDepositAmountOne] = useState<FormatValue>({
    value: new BigNumber(0),
    format: "0",
  });
  const [depositAmountTwo, setDepositAmountTwo] = useState<FormatValue>({
    value: new BigNumber(0),
    format: "0",
  });

  const [balanceOne, setBalanceOne] = useState(1.091);
  const [balanceTwo, setBalanceTwo] = useState(0.9101);

  const [error, setError] = useState<Status>("success");

  const [poolTick, setPoolTick] = useState({
    tickLower: 0,
    tickUpper: 0,
    currentTick: 0,
  });

  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
    current: "",
  });

  const [pool, setPool] = useState(null);

  const initBalance = async () => {
    console.log(state.account.address, library);
    const ethBalance = await library.web3.eth.getBalance(state.account.address);
    const usdtBalance = await library.methods
      .Market(library.addresses.USDT_TOKEN)
      .getBalance(state.account.address);

    setBalanceOne(ethBalance);
    setBalanceTwo(usdtBalance);
  };

  const initPool = async () => {
    const { pool, bundle } = await getUniswapV3PoolOverview(
      library.addresses.UNISWAP_WETH_USDT
    );

    console.log(pool, library.wallet.network);

    const baseTokenCurrency = new Token(
      Number(library.wallet.network),
      pool.token0.id,
      Number(pool.token0.decimals),
      pool.token0.symbol,
      pool.token0.name
    );

    const quoteTokenCurrency = new Token(
      Number(library.wallet.network),
      pool.token1.id,
      Number(pool.token1.decimals),
      pool.token1.symbol,
      pool.token1.name
    );

    const uniPool = new Pool(
      baseTokenCurrency,
      quoteTokenCurrency,
      (parseInt(pool.feeTier, 10) as any) as FeeAmount,
      pool.sqrtPrice,
      pool.liquidity,
      parseInt(pool.tick || "0", 10),
      []
    );

    console.log("uniPool", uniPool);
    const {
      tickLower,
      tickUpper,
    } = await library.methods.cellarWethUsdt.cellarTickInfo(0);

    console.log("tick ************************");
    console.log(tickLower, tickUpper, pool.tick);

    const priceMin = getPriceFromTick(
      tickLower,
      Number(uniPool.token0.decimals),
      Number(uniPool.token1.decimals)
    );
    const priceMax = getPriceFromTick(
      tickUpper,
      Number(uniPool.token0.decimals),
      Number(uniPool.token1.decimals)
    );
    const priceCurrent = getPriceFromTick(
      uniPool.tickCurrent,
      Number(uniPool.token0.decimals),
      Number(uniPool.token1.decimals)
    );

    setPoolTick({
      tickLower,
      tickUpper,
      currentTick: uniPool.tickCurrent,
    });

    setPriceRange({
      min: priceMin,
      max: priceMax,
      current: priceCurrent,
    });

    setPool(uniPool);
  };

  // tokenNum: 0 or 1 => token0 or token1
  const handleUpdateInputAmount = (amount, tokenNum) => {
    const decimals =
      tokenNum === 0 ? pool.token0.decimals : pool.token1.decimals;

    const val = {
      format: amount,
      value: new BigNumber(amount).multipliedBy(10 ** decimals),
    };

    if (tokenNum === 0) {
      setDepositAmountOne(val);
    } else {
      setDepositAmountTwo(val);
    }

    const decimals2 =
      tokenNum === 0 ? pool.token1.decimals : pool.token0.decimals;
    // const diff2 = (Number(priceRange.min) + Number(priceRange.max)) / 2 - Number(priceRange.current)
    // console.log('diff2', diff2)

    // const diff = new BigNumber(priceRange.current).plus(diff2)

    const diff = (Number(priceRange.min) + Number(priceRange.max)) / 2
    
    const priceDiff = tokenNum === 0 ? diff : new BigNumber(1).dividedBy(diff);
    const val2 = {
      format: new BigNumber(amount)
        .multipliedBy(priceDiff)
        .toFixed(4),
      value: new BigNumber(amount)
        .multipliedBy(10 ** decimals2)
        .multipliedBy(priceDiff),
    };

    console.log("************************");
    console.log(val.format, val2.format);
    console.log("************************");
    if (tokenNum === 0) {
      setDepositAmountTwo(val2);
    } else {
      setDepositAmountOne(val2);
    }
  };

  useEffect(() => {
    if (status === runningStatus.STATUS_LOADING) {
      setError("loading");
    }
  }, [status]);

  useEffect(() => {
    console.log("libarary", library);
    if (state.account.address && library) {
      initPool();
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
      <span className={styles["vaults-content-subtitle"]}>Select a Vault</span>

      <div
        className={styles["vaults-selector"]}
        role="button"
        onClick={(e) => onSelectVault()}
      >
        <div className={styles["vaults-selector-content"]}>
          <div className={cn(styles["vaults-selector-icon"], styles.uniswap)}>
            <img src="/assets/tokens/uniswap-red.svg" />
          </div>
          <div className={styles["vaults-selector-icon"]}>
            <img src="/assets/tokens/weth.svg" />
          </div>
          <div className={styles["vaults-selector-icon"]}>
            <img src="/assets/tokens/usdt.svg" />
          </div>
          <span className={styles["vaults-selector-title"]}>
            WETH / USDT - 0.05%
          </span>
        </div>
        <div className={styles["vaults-selector-combo"]}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>

      <div className={styles["vaults-row"]}>
        <div className={styles["vaults-row-value"]}>
          <span className={styles.name}>
            APY
            <TooltipIcon icon={faQuestionCircle} placement="top">
              <span style={{ padding: "9px 15px" }}>
                This APY is based on
                <br /> the last 90 days of data
              </span>
            </TooltipIcon>
          </span>
          <span className={styles.value}>100%</span>
        </div>
      </div>

      <span className={styles["vaults-content-subtitle"]}>Deposit Amounts</span>
      <div className={styles["vaults-row"]}>
        <DepositAmountInput
          token="weth"
          decimals={18}
          inputValue={depositAmountOne.format}
          balance={balanceOne}
          onChange={(value) => {
            handleUpdateInputAmount(value, 0);
          }}
          onClickMax={(e) => {
            handleUpdateInputAmount(new BigNumber(balanceOne).dividedBy(10 ** 18), 0);
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
            handleUpdateInputAmount(new BigNumber(balanceTwo).dividedBy(10 ** 6), 1);
          }}
        />
      </div>
      <span className={styles["vaults-content-subtitle"]}>
        Current Price Ranges
      </span>
      <div className={styles["vaults-row"]}>
        <PriceRange
          className={styles["vaults-row-price"]}
          title="min price"
          value={priceRange.min}
          description="ETH per USDT"
        />
        <PriceRange
          className={styles["vaults-row-price"]}
          title="max price"
          value={priceRange.max}
          description="ETH per USDT"
        />
      </div>
      <div className={styles["vaults-row"]}>
        <div className={styles["vaults-service-fee-panel"]}>
          <div className={styles.row}>
            <span>Service Fee:</span>
            <span>0.3% annual</span>
          </div>
          <div className={styles.row}>
            <span>Strategy Owner Fee:</span>
            <span>0.1% monthly</span>
          </div>
          <div className={styles.row}>
            <span>Validator Fee:</span>
            <span>0.05% annual</span>
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
