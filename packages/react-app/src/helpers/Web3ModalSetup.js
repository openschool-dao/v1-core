import Web3Modal from 'web3modal'

const Web3ModalSetup = () =>
  new Web3Modal({
    network: 'mainnet', // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
    cacheProvider: true, // optional
    theme: 'dark', // optional. Change to "dark" for a dark theme.
    providerOptions: {},
  })

export default Web3ModalSetup
