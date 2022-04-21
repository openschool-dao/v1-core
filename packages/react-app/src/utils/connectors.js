import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { }  from '@web3-react/metamask'
const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})

const walletconnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})

const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: 'OpenSchoolDAO',
})

export const connectors = {
  injected: injected,
  // metamask: metamaskconnect,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink,
}
