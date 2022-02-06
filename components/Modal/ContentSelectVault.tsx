import React, { useState } from "react";

import styles from "./Modal.module.css";
import cn from "classname"

const ContentSelectVault = () => {
  // const [val, setVal] = useState("");

  return (
    <div className={styles["modal-select-vault"]}>
      <span className={styles["modal-view-title"]}>Select a Vault</span>
      {/* <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className={styles["search-token-amm"]}
        placeholder="Search token or AMM"
      /> */}
      <div className={styles["modal-view-divider"]} style={{ marginTop: 26, marginBottom: 20 }}/>

      <div className={styles["modal-select-vault-search-result"]}>
        <div className={styles["modal-select-vault-search-item"]}>
          <div className={cn(styles.icon, styles.uniswap)}>
            <img src="/assets/tokens/uniswap-red.svg" />
          </div>
          <div className={styles.icon}>
            <img src="/assets/tokens/weth.svg" />
          </div>
          <div className={styles.icon}>
            <img src="/assets/tokens/usdt.svg" />
          </div>
          <span className={styles.name}>WETH / USDT</span>
          <span className={styles.fee}>0.05%</span>
        </div>
      </div>
    </div>
  );
};

export default ContentSelectVault;
