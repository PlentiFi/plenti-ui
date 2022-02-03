import React from 'react'

import { convertWeiToValue } from '../../utils/number'

import styles from './DepositAmountInput.module.css'

const DepositAmountInput = ({ token, decimals, inputValue, balance, onChange, onClickMax }) => {
  return (
    <div className={styles['deposit-amount-input-container']}>
      <div className={styles['deposit-input-icon']}>
        <img src={`/assets/tokens/${token}.svg`} />
      </div>
      <div className={styles['deposit-input-content']}>
        <div className={styles['deposit-input-label']}>
          {token}
        </div>
        <div className={styles['deposit-input-box']}>
          <input type="text" className={styles['deposit-input-text']} value={inputValue} onChange={(e) => onChange(e.target.value)} />
          <div className={styles['deposit-input-description']}>
            <span className={styles['balance']}>balance</span>
            <span className={styles['value']}>{convertWeiToValue(balance, decimals)}</span>
            <button className={styles['max']} onClick={(e) => onClickMax()}>max</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepositAmountInput
