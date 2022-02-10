import React from "react";

import BigNumber from 'bignumber.js'

import DepositAmountValue from '../DepositAmountValue'
import PriceRange from '../PriceRange'
import VaultItem from '../VaultItem'

import styles from "./Modal.module.css";

const ContentAddLiquidity = ({ onConfirm, amountOne, amountTwo, priceRange, ethPrice }) => {
  return (
    <div className={styles["modal-add-liqudity-confirm"]}>
      <span className={styles["modal-view-title"]}>Confirm Add Liquidity</span>

      <div className={styles["selected-vault"]}>
        <VaultItem
          name={'ETH-USDT'}
          fee={0.05}
          badges={["ETHEREUM", "UNISWAP V3"]}
          onSelectVault={() => { }}
        />
      </div>

      <div className={styles["inputed-value"]}>
        <DepositAmountValue token='weth' balance={amountOne.format} usdBalance={new BigNumber(amountOne.value).dividedBy(10 ** 18).multipliedBy(new BigNumber(ethPrice)).toFixed(2)} />
        <DepositAmountValue token='usdt' balance={amountTwo.format} usdBalance={amountTwo.format} />
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <span className={styles["modal-view-title"]}>Current Price Ranges</span>
      </div>

      <div className={styles['price-range']}>
        <PriceRange className={styles.item} title="min price" value={priceRange.min} description="USDT per ETH" />
        <PriceRange className={styles.item} title="max price" value={priceRange.max} description="USDT per ETH" />
      </div>

      <button className={styles['add-liquidity-button']} onClick={(e) => onConfirm()}>Confirm</button>
    </div>
  );
};

export default ContentAddLiquidity;
