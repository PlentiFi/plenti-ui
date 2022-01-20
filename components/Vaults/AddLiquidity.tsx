import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import DepositAmountInput from '../DepositAmountInput'

import styles from './Vaults.module.css'

const AddLiquidity = () => {

  const [depositAmountOne, setDepositAmountOne] = useState(0)
  const [depositAmountTwo, setDepositAmountTwo] = useState(0)

  const [balanceOne, setBalanceOne] = useState(1.091)
  const [balanceTwo, setBalanceTwo] = useState(0.9101)

  return (
    <div className={styles['vaults-content']}>
      <span className={styles['vaults-content-subtitle']}>Select a Vault</span>

      <div className={styles['vaults-selector']}>
        <div className={styles['vaults-selector-content']}>
          <div className={styles['vaults-selector-icon']}>
            <img src="/assets/tokens/uniswap.svg" />
          </div>
          <div className={styles['vaults-selector-icon']}>
            <img src="/assets/tokens/eth.svg" />
          </div>
          <div className={styles['vaults-selector-icon']}>
            <img src="/assets/tokens/wbtc.svg" />
          </div>
          <span className={styles['vaults-selector-title']}>WBTC / ETH</span>
        </div>
        <div className={styles['vaults-selector-combo']}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>

      <div className={styles['vaults-row']}>
        <div className={styles['vaults-row-value']}>0.3% fee tier</div>
        <div className={styles['vaults-row-value']}>100% APY <FontAwesomeIcon icon={faQuestionCircle} /></div>
      </div>

      <span className={styles['vaults-content-subtitle']}>Deposit Amounts</span>
      <div className={styles['vaults-row']}>
        <DepositAmountInput 
          token='eth'
          inputValue={depositAmountOne}
          balance={balanceOne}
          onChange={(value) => setDepositAmountOne(value)}
          onClickMax={(e) => setDepositAmountOne(balanceOne)}
        />
      </div>
      <div className={styles['vaults-row']}>
        <DepositAmountInput
          token='wbtc'
          inputValue={depositAmountTwo}
          balance={balanceTwo}
          onChange={(value) => setDepositAmountTwo(value)}
          onClickMax={(e) => setDepositAmountTwo(balanceTwo)}
        />
      </div>
      <span className={styles['vaults-content-subtitle']}>Current Price Ranges</span>
      <div className={styles['vaults-row']}>
        <div className={styles['vaults-row-price']}>
          <span className={styles.min}>min price</span>
          <span className={styles.value}>692.06</span>
          <span className={styles.per}>ETH per WBTC</span>
        </div>
        <div className={styles['vaults-row-price']}>
          <span className={styles.min}>max price</span>
          <span className={styles.value}>2750.7</span>
          <span className={styles.per}>WBTC per ETH</span>
        </div>
      </div>
      <div className={styles['vaults-row']}>
        <button className={styles['vaults-button']}>Add Liquidity</button>
      </div>
    </div>
  )
}

export default AddLiquidity
