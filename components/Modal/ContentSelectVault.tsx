import React, { useState } from "react";

import styles from "./Modal.module.css";

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
      <div className={styles["modal-view-divider"]} style={{ marginTop: 43, marginBottom: 23 }}/>

      <div className={styles["modal-select-vault-search-result"]}>
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
    </div>
  );
};

export default ContentSelectVault;
