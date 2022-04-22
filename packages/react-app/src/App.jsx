// import { Contract } from "@ethersproject/contracts";
// import { useCall } from "@usedapp/core";
// import { addresses, abis } from "@my-app/contracts";
import Layout from './components/Layout'
import './index.css'
import Home from './pages/Home'

function App() {
  // Read more about useDapp on https://usedapp.io/
  // const { error: contractCallError, value: tokenBalance } =
  //   useCall({
  //     contract: new Contract(addresses.ceaErc20, abis.erc20),
  //     method: "balanceOf",
  //     args: ["0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C"],
  //   }) ?? {};

  return (
    <>
      <Layout>
        <Home />
      </Layout>
    </>
  )
}

export default App
