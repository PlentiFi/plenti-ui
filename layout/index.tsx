import React, { useReducer, useState } from 'react'
import BigNumber from 'bignumber.js'
import Head from 'next/head'
import { useEffect } from 'react'
import useWallet from 'hooks/useWallet'
import Account from 'components/Account'
import { toNumber } from 'utils/common'
import { addresses, ZERO } from 'utils/constants'
import { reducer, initState } from './store'

import Link from 'next/link'

import cn from 'classname'
import styles from './Layout.module.css'

const FETCH_TIME = 15
let balanceTimer = null

const networkLabels = {
  1: 'Ethereum Network',
  4: 'Rinkeby Testnet',
  3: 'Ropsten Testnet',
  5: 'Goreli Testnet',
  42: 'Kovan Testnet',
  56: 'Binance Network',
  97: 'Binance Testnet',
}

export function accountBalance(library, dispatch) {
  if (!library || !library.initiated) return
  const account = library.wallet.address
  const fromWei = (value, decimals = 18) =>
    decimals < 18
      ? new BigNumber(value).div(10 ** decimals).toFixed(decimals, 0)
      : library.web3.utils.fromWei(value)
  if (!addresses[library.wallet.network]) {
    return
  }
  Promise.all([
    library.web3.eth.getBalance(account),
    library.methods.SommToken.getBalance(account),
    // library.methods.Airdrop.received(account),
    // library.methods.Airdrop.deadline(),
  ])
    .then(
      ([
        _balance,
        _sommBalance,
        // _received,
        // _deadline,
      ]) => {
        const balance = toNumber(fromWei(_balance))
        const sommBalance = toNumber(fromWei(_sommBalance))
        // const airdropReceived = _received
        // const deadline = _deadline

        dispatch({
          type: 'balance',
          payload: {
            balance,
            sommBalance,
          },
        })
      }
    )
    .catch(console.log)
}

export default function Layout({
  children,
  router,
  networks,
}) {
  const [state, dispatch] = useReducer(reducer, initState)
  const [loading, connectWallet, library, disconnectWallet] = useWallet(dispatch)
  const [restored, setRestored] = useState(false)
  const [connectModalShow, setConnectModalShow] = useState(false)

  const getBalance = () => {
    accountBalance(library, dispatch)
  }

  useEffect(() => {
    if (library && state.account.address) {
      if (balanceTimer) clearInterval(balanceTimer)
      balanceTimer = setInterval(getBalance, FETCH_TIME * 1000)
      getBalance()
    }
    return () => balanceTimer && clearInterval(balanceTimer)
  }, [library, state.account.address])

  const handleConnectNetwork = () => {
    setConnectModalShow(true)
  }

  return (
    <>
      <Head>
        <title>Plenti</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <link
          href="https://necolas.github.io/normalize.css/latest/normalize.css"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='page-background'>
        <div className='ball'></div>
      </div>
      <main className={styles.main}>
        <header className={styles.header}>
          <a href="/" className={styles.headerLogo}><img src="/assets/logo/plenti-ball.png" alt="plenti" /></a>
          <div className={styles.headerConnect}>
            <Account
              library={library}
              {...state}
              loading={loading}
              dispatch={dispatch}
              connectWallet={() => connectWallet(true)}
              disconnectWallet={() => disconnectWallet()}
            />
          </div>
        </header>
        <div className={styles['main-container']}>
          <div className={styles['tab-container']}>
            <div className={cn(styles.link, { [styles.active]: true })}>
              <Link href="/vaults">Vaults</Link>
            </div>
            <div className={styles.link}>
              <img src="/assets/hot.svg" />
              <Link href="/vaults">Hot</Link>
            </div>
            <div className={styles.link}>
              <Link href="/vaults">Portfolio</Link>
            </div>
            <div className={styles.link}>
              <Link href="/vaults">Charts</Link>
            </div>
            <div className={styles.link}>
              <Link href="/vaults">About</Link>
            </div>
          </div>
          <div className={styles['page-container']}>
            {React.cloneElement(children, {
                state,
                dispatch,
                library,
                networks,
              })}
          </div>
        </div>
      </main>
    </>
  )
}
