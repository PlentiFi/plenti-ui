import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

import DepositAmountInput from '../DepositAmountInput'

import cn from 'classname'

import styles from './Vaults.module.css'

const RemoveLiquidity = () => {

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
        {/* <div className={styles['vaults-row-arrow']}>
          <FontAwesomeIcon icon={faArrowDown} />
        </div> */}
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
      <div className={styles['vaults-row']}>
        <button className={styles['vaults-button']}>Remove Liquidity</button>
      </div>
    </div>
  )
}

export default RemoveLiquidity
