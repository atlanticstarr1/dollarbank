import React from "react";
import {
  Heading,
  Box,
  Text,
  Flex,
  PublicAddress,
  Card,
  Pill,
  QR
} from "rimble-ui";
import NetworkIndicator from "@rimble/network-indicator";
import useBankContract from "../utils/useBankContract";
import ethToUsd from "../utils/ethToUsd";
import { requiredNetwork } from "../constants";

const BankStats = () => {
  const {
    drizzleState,
    minBalanceEth,
    minBalanceUsd,
    interestRate,
    contractBalanceEth,
    contractAddress,
    oneUsdEth
  } = useBankContract();

  return (
    <Card mx={"auto"} px={4} mb={1}>
      <Flex mb={4}>
        <Box flex={1 / 2}>
          <NetworkIndicator
            currentNetwork={drizzleState.web3.networkId}
            requiredNetwork={requiredNetwork}
          />
        </Box>
        <Box flex={1}>
          <Heading.h4>Welcome to DollarBank</Heading.h4>
        </Box>
      </Flex>
      <Flex mb={3}>
        <Box flex={1}>
          <Text>Get paid daily</Text>
          <Pill color="primary">{interestRate}% INTEREST</Pill>
        </Box>
        <Box flex={1}>
          <Text>Minimum balance</Text>
          <Pill color="primary">
            ${minBalanceUsd} USD (~{minBalanceEth} ETH)
          </Pill>
        </Box>
        <Box flex={1}>
          <Text>Trusted with</Text>
          <Pill color="green">
            ${ethToUsd(oneUsdEth, contractBalanceEth)} USD (~
            {contractBalanceEth} ETH)
          </Pill>
        </Box>
      </Flex>
      <Flex mr={3}>
        <Box flex={1}>
          <Flex alignItems={"flex-start"}>
            <Flex mr={3}>
              <Flex>
                {contractAddress && (
                  <QR value={contractAddress} size={100} renderAs={"svg"} />
                )}
              </Flex>
            </Flex>
            <Box>
              <PublicAddress address={contractAddress} label="Bank address" />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
};
export default BankStats;
