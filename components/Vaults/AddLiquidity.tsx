import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

import DepositAmountInput from "../DepositAmountInput";
import PriceRange from "../PriceRange";
import Account from "../Account";
import TooltipIcon from "../TooltipIcon";

import { isNaN, compare } from '../../utils/number'

import cn from "classname";
import styles from "./Vaults.module.css";

type Status = "success" | "noAmount" | "insufficientBalance";

const errorMsg = {
  success: "Add Liquidity",
  noAmount: "Enter an amount",
  insufficientBalance: "Insufficient balance",
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
}) => {
  const [depositAmountOne, setDepositAmountOne] = useState(0);
  const [depositAmountTwo, setDepositAmountTwo] = useState(0);

  const [balanceOne, setBalanceOne] = useState(1.091);
  const [balanceTwo, setBalanceTwo] = useState(0.9101);

  const [error, setError] = useState<Status>("success");

  useEffect(() => {
    if (isNaN(depositAmountOne) || isNaN(depositAmountTwo)) {
      setError('noAmount')
      return
    }

    if (compare(depositAmountOne, 0) <= 0|| compare(depositAmountTwo, 0) <= 0) {
      setError('noAmount')
      return
    }

    if (compare(depositAmountOne, balanceOne) > 0 || compare(depositAmountTwo, balanceTwo) > 0) {
      setError('insufficientBalance')
      return
    }

    setError('success')

  }, [depositAmountOne, depositAmountTwo, balanceOne, balanceTwo])

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
            <img src="/assets/tokens/uniswap.svg" />
          </div>
          <div className={styles["vaults-selector-icon"]}>
            <img src="/assets/tokens/eth.svg" />
          </div>
          <div className={styles["vaults-selector-icon"]}>
            <img src="/assets/tokens/wbtc.svg" />
          </div>
          <span className={styles["vaults-selector-title"]}>WBTC / ETH</span>
        </div>
        <div className={styles["vaults-selector-combo"]}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>

      <div className={styles["vaults-row"]}>
        <div className={styles["vaults-row-value"]}>
          <span className={styles.name}>Fee tier</span>
          <span className={styles.value}>0.3%</span>
        </div>
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
          token="eth"
          inputValue={depositAmountOne}
          balance={balanceOne}
          onChange={(value) => setDepositAmountOne(value)}
          onClickMax={(e) => setDepositAmountOne(balanceOne)}
        />
      </div>
      <div className={styles["vaults-row"]}>
        <DepositAmountInput
          token="wbtc"
          inputValue={depositAmountTwo}
          balance={balanceTwo}
          onChange={(value) => setDepositAmountTwo(value)}
          onClickMax={(e) => setDepositAmountTwo(balanceTwo)}
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
        {state.account.address ? (
          <ActionButton status={error} onAction={() => onAddLiquidity()} />
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
