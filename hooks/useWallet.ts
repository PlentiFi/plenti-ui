import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import PlentiLibrary from "lib/index";
import { addresses, DEFAULT_NETWORK } from 'utils/constants'
import { isMobileOnly } from "react-device-detect";

let web3Modal

type TWallet = [boolean, Function, any, Function]

const events = []

export default function useWallet(dispatch) {
  const [library, setLibrary] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: process.env.INFURA_PROJECT_ID, // Required
        },
      },
    };
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
      theme: {
        background: "#000000",
        main: "#FFF",
        secondary: "#727171",
        border: "#FFFFFF",
        hover: "rgb(16, 26, 32)",
      },
    });
  }, [])

  const handleEvent = (event) => {
    switch (event.event) {
      case 'WALLET': {
        if (event.status === 3) {
          dispatch({ type: 'disconnect' })
        } else {
          if (event.status !== 0) {
            dispatch({ type: 'account', payload: event.data })
          }
        }
        break
      }
      default: {
        if (event.event && events.includes(event.event)) {
          console.log(event)
        }
        break
      }
    }
  }

  const initLibrary = (provider) => {
    if (library) {
      console.log("Library updated");
      library.setProvider(provider)
    } else {
      console.log('Library created')
      setLibrary(
        new PlentiLibrary(provider, {
          onEvent: handleEvent,
          addresses,
        })
      );
    }
  }

  async function getProvider(refresh) {
    if (refresh && web3Modal) {
      web3Modal.clearCachedProvider()
    }
    try {
      setLoading(true)
      const provider = await web3Modal.connect()
      setLoading(false)
      return provider
    } catch (e) {
      setLoading(false)
      return null
    }
  }

  function connectWallet(refresh = false) {
    getProvider(refresh).then(async (provider) => {
      if (provider){ 
        console.log("isMobileOnly", isMobileOnly);
        if (!isMobileOnly) {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${DEFAULT_NETWORK.toString(16)}` }],
          });
        }

        initLibrary(provider)
      }
    })
  }

  async function disconnectWallet() {
    // dispatch({ type: "disconnect" })
    await web3Modal.clearCachedProvider()
    window.location.href = '/'
  }

  const ret: TWallet = [loading, connectWallet, library, disconnectWallet]
  return ret
}
