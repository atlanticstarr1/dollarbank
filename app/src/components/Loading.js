import React from "react";
import { Box, Flex, Text, Loader, Flash, Card } from "rimble-ui";
import ConnectionBanner from "@rimble/connection-banner";
import NetworkIndicator from "@rimble/network-indicator";
import { drizzleReactHooks } from "drizzle-react";
import { requiredNetwork } from "../constants";

const LoadStatus = ({ message }) => {
  const drizzleState = drizzleReactHooks.useDrizzleState(
    drizzleState => drizzleState
  );

  return (
    <>
      <Box mx={"auto"} p={1}>
        <ConnectionBanner
          currentNetwork={drizzleState.web3.networkId}
          requiredNetwork={requiredNetwork}
        />
      </Box>
      <Card mx={"auto"} p={4}>
        <NetworkIndicator
          currentNetwork={drizzleState.web3.networkId}
          requiredNetwork={requiredNetwork}
        />
      </Card>
      <Box
        maxWidth={"640px"}
        mx={"auto"}
        bg={"#f6f6fc"}
        p={3}
        display={["none", "block"]}
      >
        <Flex alignItems={"center"}>
          <Box position={"relative"} width={"4em"}>
            <Box>
              <Loader size={"3em"} />
            </Box>
          </Box>
          <Box>
            <Text fontWeight={4}>{message}...</Text>
            <Text fontWeight={2}>Please wait</Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

const LoadError = () => {
  return (
    <Flash my={3} variant="danger">
      This browser has no connection to the Ethereum network. Please use the
      Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or
      Parity.
    </Flash>
  );
};

const Web3Error = () => {
  return (
    <Flash my={3} variant="danger">
      Error loading Web3.
    </Flash>
  );
};

export { LoadStatus, LoadError, Web3Error };
