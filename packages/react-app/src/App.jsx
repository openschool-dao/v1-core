import { useEffect, useState } from "react";
import { VStack, useDisclosure, Button, Text, HStack, Select, Box } from "@chakra-ui/react";
import SelectWalletModal from "./components/Modal";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { networkParams } from "./utils/networks";
import { connectors } from "./utils/connectors";
import { toHex, truncateAddress } from "./utils/utils";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { library, chainId, account, activate, /*deactivate,*/ active } = useWeb3React();
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);

  const handleNetwork = e => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]],
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  // const refreshState = () => {
  //   window.localStorage.setItem("provider", undefined);
  //   setNetwork("");
  // };

  // const disconnect = () => {
  //   refreshState();
  //   deactivate();
  // };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <VStack justifyContent="center" alignItems="center" h="100vh">
        <HStack marginBottom="10px">
          <Text margin="0" lineHeight="1.15" fontSize={["1.5em", "2em", "3em", "4em"]} fontWeight="600">
            Let's connect with OpenSchoolDAO
          </Text>
        </HStack>
        <HStack>
          {!active ? (
            <Button onClick={onOpen}>Connect Wallet</Button>
          ) : (
            <span>You are connected</span>
            // <Button onClick={disconnect}>Disconnect</Button>
          )}
        </HStack>
        <VStack justifyContent="center" alignItems="center" padding="10px 0">
          <HStack>
            <Text>{`Connection Status: `}</Text>
            {active ? <CheckCircleIcon color="green" /> : <WarningIcon color="#cd5700" />}
          </HStack>

          <Tooltip label={account} placement="right">
            <Text>{`Account: ${truncateAddress(account)}`}</Text>
          </Tooltip>
          <Text>{`Network ID: ${chainId ? chainId : "No Network"}`}</Text>
        </VStack>
        {active && (
          <HStack justifyContent="flex-start" alignItems="flex-start">
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" padding="10px">
              <VStack>
                <Button onClick={switchNetwork} isDisabled={!network}>
                  Switch Network
                </Button>
                <Select placeholder="Select network" onChange={handleNetwork}>
                  <option value="1">Ethereum Mainnet</option>
                  <option value="3">Ropsten</option>
                  <option value="4">Rinkeby</option>
                  <option value="5">Goerli</option>
                  <option value="42">Kovan</option>
                </Select>
              </VStack>
            </Box>
          </HStack>
        )}
        <Text>{error ? error.message : null}</Text>
      </VStack>
      <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
}
