import { AppProps } from 'next/app'
import Layout from 'layout'

import 'styles/globals.css'
import 'react-popper-tooltip/dist/styles.css';

import { DEFAULT_NETWORK } from '../utils/constants'

const allowedNetworks = [DEFAULT_NETWORK]

function App({ Component, router }: AppProps) {
  return (
    <Layout router={router} networks={allowedNetworks}>
      <Component />
    </Layout>
  )
}

export default App
