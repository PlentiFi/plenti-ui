import React, { useState } from "react";

import DepositAmountValue from '../DepositAmountValue'
import PriceRange from '../PriceRange'

import styles from "./Modal.module.css";
import cn from "classname";

const ContentAddLiquidity = ({ onConfirm }) => {
  return (
    <div className={styles["modal-add-liqudity-confirm"]}>
      <span className={styles["modal-view-title"]}>Confirm Add Liquidity</span>

      <div className={styles["selected-vault"]}>
        <div className={styles["modal-select-vault-search-item"]}>
          <div className={styles.icon}>
            <img src="/assets/tokens/uniswap-red.svg" />
          </div>
          <div className={styles.icon}>
            <img src="/assets/tokens/eth.svg" />
          </div>
          <div className={styles.icon}>
            <img src="/assets/tokens/wbtc.svg" />
          </div>
          <span className={styles.name}>WBTC / ETH</span>
          <span className={styles.fee}>0.05%</span>
        </div>
      </div>

      <div className={styles["inputed-value"]}>
        <DepositAmountValue token='wbtc' balance={0.342719} usdBalance={950.00} />
        <DepositAmountValue token='eth' balance={0} usdBalance={0} />
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <span className={styles["modal-view-title"]}>Current Price Ranges</span>
      </div>

      <div className={styles['price-range']}>
        <PriceRange className={styles.item} title="min price" value={692.06} description="ETH per WBTC" />
        <PriceRange className={styles.item} title="min price" value={692.06} description="ETH per WBTC" />
      </div>

      <button className={styles['add-liquidity-button']} onClick={(e) => onConfirm()}>Confirm</button>
    </div>
  );
};

export default ContentAddLiquidity;
