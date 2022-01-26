import React, { useReducer, useState } from "react";

import Account from "../Account";

import styles from './Vaults.module.css'

const RemoveLiquidity = ({ library, state, onConnectWallet }) => {

  const [amount, setAmount] = useState('');

  return (
    <div className={styles['vaults-content']}>
      <span className={styles['vaults-content-subtitle']}>Amount to Remove</span>
      <div className={styles['vaults-row2']}>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className={styles['vaults-remove-amount-input']} />
        <span className={styles['vaults-remove-amount-percent']}>%</span>
      </div>
      <div className={styles['vaults-row3']}>
        <span className={styles['vaults-content-subtitle']}>You will Receive</span> 
        <div className={styles['vaults-row-arrow']}>
          <img src="/assets/arrow-down.png" />
        </div>
      </div>
      <div className={styles['vaults-row2']}>
        <div className={styles['valuts-receive']}>
          <div className={styles['valuts-receive-icon']}>
            <img src="/assets/tokens/wbtc.svg" />
          </div>
          <div className={styles['valuts-receive-value']}>
            {0}
          </div>
        </div>
        <div className={styles['valuts-receive']}>
          <div className={styles['valuts-receive-icon']}>
            <img src="/assets/tokens/eth.svg" />
          </div>
          <div className={styles['valuts-receive-value']}>
            {0}
          </div>
        </div>
      </div>
      <div className={styles['valuts-receive-mode']}>Receive in WETH</div>
      <div className={styles["vaults-row3"]}>
        {state.account.address ? (
          <button className={styles['vaults-button']}>Remove Liquidity</button>
        ) : (
            <Account
              library={library}
              className='white-full-width'
              {...state}
              connectWallet={() => onConnectWallet(true)}
            />
          )}
      </div>
    </div>
  )
}

export default RemoveLiquidity
