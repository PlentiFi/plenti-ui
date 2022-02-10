import React, { useState } from "react";

import VaultItem from '../VaultItem'

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
      <div className={styles["modal-view-divider"]} style={{ marginTop: 26, marginBottom: 20 }}/>

      <div className={styles["modal-select-vault-search-result"]}>
        <VaultItem
          name={'ETH-USDT'}
          fee={0.05}
          badges={["ETHEREUM", "UNISWAP V3"]}
          onSelectVault={() => {}}
        />
      </div>
    </div>
  );
};

export default ContentSelectVault;
