import React from 'react'

import styles from './DepositAmountValue.module.css'

const DepositAmountValue = ({ token, balance, usdBalance }) => {
  return (
    <div className={styles['deposit-amount-value-container']}>
      <div className={styles['deposit-value-icon']}>
        <img src={`/assets/tokens/${token}.svg`} />
      </div>
      <div className={styles['deposit-value-content']}>
        <span className={styles['balance']}>{balance}</span>
        <span className={styles['usd']}>{`$${usdBalance}`}</span>
      </div>
    </div>
  )
}

export default DepositAmountValue
