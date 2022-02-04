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

import styles from './Layout.module.css'
import cn from 'classname'

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

export default function Layout({
  children,
  router,
  networks,
}) {
  const [state, dispatch] = useReducer(reducer, initState)
  const [loading, connectWallet, library, disconnectWallet] = useWallet(dispatch)
  const [restored, setRestored] = useState(false)

  // useEffect(() => {
  //   if (router.route === '/vaults' && !library) {
  //     connectWallet()
  //   }
  // }, [router, library])

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
            <div className={cn(styles.link, { [styles.active]: router.route.includes('/vaults') })}>
              <Link href="/vaults">Vaults</Link>
            </div>
            <div className={cn(styles.link, { [styles.active]: router.route.includes('/hot') })}>
              <img src="/assets/hot.svg" />
              <Link href="/blog">Hot</Link>
            </div>
            <div className={styles.link}>
              <Link href="/vaults">Portfolio</Link>
            </div>
            <div className={styles.link}>
              <Link href="/events">Events</Link>
            </div>
            <div className={cn(styles.link, styles.social)}>
              <a href="https://discord.gg/tfmktwrxNb" target="_blank"><img src="/assets/socials/discord.svg" /></a>
            </div>
            <div className={cn(styles.link, styles.social)}>
              <a href="https://twitter.com/plenti_fi" target="_blank"> <img src="/assets/socials/twitter.svg" /></a >
            </div>
          </div>
          <div className={styles['page-container']}>
            {React.cloneElement(children, {
                state,
                dispatch,
                library,
                networks,
                connectWallet
              })}
          </div>
        </div>
      </main>
    </>
  )
}
