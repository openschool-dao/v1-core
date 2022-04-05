import './App.css'

import React, { useCallback, useEffect, useState } from 'react'
import { Link, Route, Switch, useLocation } from 'react-router-dom'

import logo from './logo.svg'

import { Account } from './components'

import { Web3ModalSetup } from './helpers'
import { NETWORKS, ALCHEMY_KEY } from './constants'

const { ethers } = require('ethers')

const initialNetwork = NETWORKS.localhost // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true
const NETWORKCHECK = true
const USE_BURNER_WALLET = true // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false

const web3Modal = Web3ModalSetup()

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, 'mainnet', 'rinkeby']

  const [injectedProvider, setInjectedProvider] = useState()
  const [address, setAddress] = useState()
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0])
  const location = useLocation()

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == 'function') {
      await injectedProvider.provider.disconnect()
    }
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new ethers.providers.Web3Provider(provider))

    provider.on('chainChanged', chainId => {
      console.log(`chain changed to ${chainId}! updating providers`)
      setInjectedProvider(new ethers.providers.Web3Provider(provider))
    })

    provider.on('accountsChanged', () => {
      console.log(`account changed!`)
      setInjectedProvider(new ethers.providers.Web3Provider(provider))
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
      logoutOfWeb3Modal()
    })
    // eslint-disable-next-line
  }, [setInjectedProvider])

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, [loadWeb3Modal])

  return (
    <div className="Open School">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://github.com/openschool-dao/v1-core"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open School
        </a>
      </header>
    </div>
  )
}

export default App
