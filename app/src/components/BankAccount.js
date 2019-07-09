import React, { useMemo } from "react";
import { Flex, Box, Text, Card, Heading, Icon } from "rimble-ui";
import useBankContract from "../utils/useBankContract";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import CloseAccount from "./CloseAccount";
import ShowBankBalance from "./ShowBankBalance";

const BankAccount = () => {
  const { bankBalanceEth, contracts, minBalanceEth } = useBankContract();

  // const isInterestPaid = () => {
  //   console.log("interest paid");
  //   let a = contracts.DollarBank.events.filter(a => a.event === "InterestPaid");
  //   if (a.length > 0 && bankBalanceEth >= minBalanceEth) {
  //     window.toastProvider.addMessage("Interest paid", {
  //       secondaryMessage: "Check your balance",
  //       variant: "success"
  //     });
  //   }
  // };

  // useMemo(isInterestPaid, [contracts.DollarBank.events]);

  return (
    <Card px={4} mx={"auto"}>
      <Flex>
        <Box mb={4}>
          <Icon color="tomato" name="AccountBalance" size="80" />
        </Box>
        <Box flex={1} my={3}>
          <Heading.h4>Bank Account</Heading.h4>
          <Text>Deposit and Withdraw Ether.</Text>
        </Box>
      </Flex>
      <Box mb={4}>
        <ShowBankBalance balanceEth={bankBalanceEth} />
      </Box>
      <Flex>
        <Box flex={1} mr={3}>
          <Deposit />
        </Box>
        <Box flex={1} mr={3}>
          <Withdraw />
        </Box>
        <Box alignSelf={"flex-end"}>
          <CloseAccount />
        </Box>
      </Flex>
    </Card>
  );
};
export default BankAccount;
