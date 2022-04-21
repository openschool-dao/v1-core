import React, { useEffect, useState } from 'react'
import { shortenAddress, useEthers, useLookupAddress } from '@usedapp/core'

const WalletButton = () => {
  const [rendered, setRendered] = useState('')

  const ens = useLookupAddress()
  const { account, activateBrowserWallet, deactivate, error } = useEthers()

  const connectToWallet = () => {
    if (!account) {
      activateBrowserWallet()
    } else {
      deactivate()
    }
  }

  useEffect(() => {
    if (ens) {
      setRendered(ens)
    } else if (account) {
      setRendered(shortenAddress(account))
    } else {
      setRendered('')
    }
  }, [account, ens, setRendered])

  useEffect(() => {
    if (error) {
      console.error('Error while connecting wallet:', error.message)
    }
  }, [error])

  return (
    <div className="flex items-center cursor-pointer">
      <div onClick={connectToWallet} className="flex bg-gray-100 rounded-full md:rounded-lg shadow-md p-2 animation">
        <img className="w-7 mr-4 ml-3 md:ml-0" src="/metamask.svg" alt="" />
        <button className="hidden md:block lg:block xl:text-lg font-medium font">
          {rendered === '' && 'Connect Wallet'}
          {rendered !== '' && rendered}
        </button>
      </div>
    </div>
  )
}

export default WalletButton
