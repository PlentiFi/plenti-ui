import React, { useState } from 'react'
import { TMap } from 'types'
import Button from 'components/Button/Button'

import styles from './Account.module.css'

interface IAccount {
  caption?: string
  className?: string,
  library: any
  loading: boolean
  account: TMap
  balance: string
  dispatch: Function
  connectWallet: Function
  disconnectWallet: Function
}

export default function Account({
  caption,
  className,
  account,
  connectWallet,
  disconnectWallet
}: IAccount) {

  const handleDisconnect = () => {
    disconnectWallet()
  }

  return (
    <div className={`${styles['account-button-container']} ${styles[className]}`}>
      {!account.address ? (
        <Button
          className={`cursor ${styles['connect-button']} ${styles[className]}`}
          onClick={() => {
            connectWallet(true)
          }}
        >
          {caption ? caption : 'Connect Wallet'}
        </Button>
      ) : (
        <div className={styles.info}>
          <img src='/assets/tokens/eth.svg' className={styles.eth}/>
          <span>Ethereum</span>
          <img src='/assets/connected.svg' className={styles.connected} />
          <span>{`${account.address.substring(0, 7)}....${account.address.substring(account.address.length - 4)}`}</span>
        </div>
      )}
    </div>
  )
}
