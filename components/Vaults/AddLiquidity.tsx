import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

import BigNumber from 'bignumber.js'

import {
  FeeAmount,
  Pool,
  Position,
  priceToClosestTick,
  tickToPrice,
  TickMath,
} from '@uniswap/v3-sdk';

import { FormatValue } from "../../types"

import DepositAmountInput from "../DepositAmountInput";
import PriceRange from "../PriceRange";
import Account from "../Account";
import TooltipIcon from "../TooltipIcon";

import { isNaN, compare, convertWeiToValue } from '../../utils/number'
import { runningStatus } from "../../utils/constants";

import cn from "classname";
import styles from "./Vaults.module.css";

type Status = "success" | "noAmount" | "insufficientBalance" | "loading";

const errorMsg = {
  success: "Add Liquidity",
  noAmount: "Enter an amount",
  insufficientBalance: "Insufficient balance",
  loading: "Add Liquidity"
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
  status
}) => {
  const [depositAmountOne, setDepositAmountOne] = useState<FormatValue>({ value: new BigNumber(0), format: '0'});
  const [depositAmountTwo, setDepositAmountTwo] = useState<FormatValue>({ value: new BigNumber(0), format: '0' });

  const [balanceOne, setBalanceOne] = useState(1.091);
  const [balanceTwo, setBalanceTwo] = useState(0.9101);

  const [error, setError] = useState<Status>("success");

  const initBalance = async () => {
    console.log(state.account.address, library)
    const ethBalance = await library.web3.eth.getBalance(state.account.address)
    const usdtBalance = await library.methods.Market(library.addresses.USDT_TOKEN).getBalance(state.account.address)

    setBalanceOne(ethBalance)
    setBalanceTwo(usdtBalance)
  }

  useEffect(() => {
    if (status === runningStatus.STATUS_LOADING) {
      setError("loading")
    }
  }, [status])

  useEffect(() => {
    if (state.account.address && library) {
      initBalance()
    }
  }, [library, state.account.address])

  useEffect(() => {
    if (isNaN(depositAmountOne.value) || isNaN(depositAmountTwo.value)) {
      setError('noAmount')
      return
    }

    if (compare(depositAmountOne.value, 0) <= 0|| compare(depositAmountTwo.value, 0) <= 0) {
      setError('noAmount')
      return
    }

    if (
      compare(depositAmountOne.value, balanceOne) > 0 ||
      compare(depositAmountTwo.value, balanceTwo) > 0
    ) {
      setError('insufficientBalance')
      return
    }

    setError('success')

  }, [depositAmountOne, depositAmountTwo, balanceOne, balanceTwo])

  const handleAddLiquidity = () => {
    onAddLiquidity(depositAmountOne, depositAmountTwo)
  }

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
          <span className={styles["vaults-selector-title"]}>WETH / USDT - 0.05%</span>
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
            const val = {
              format: value,
              'value': new BigNumber(value).multipliedBy(10 ** 18)
            }
            setDepositAmountOne(val)
          }}
          onClickMax={(e) => {
            const val = {
              format: convertWeiToValue(balanceOne),
              'value': new BigNumber(balanceOne)
            }
            setDepositAmountOne(val)
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
            const val = {
              format: value,
              'value': new BigNumber(value).multipliedBy(10 ** 6)
            }
            setDepositAmountTwo(val)
          }}
          onClickMax={(e) => {
            const val = {
              format: convertWeiToValue(balanceTwo, 6),
              'value': new BigNumber(balanceTwo)
            }
            setDepositAmountTwo(val)
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
          value={692.06}
          description="ETH per WBTC"
        />
        <PriceRange
          className={styles["vaults-row-price"]}
          title="max price"
          value={2750.7}
          description="WBTC per ETH"
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
