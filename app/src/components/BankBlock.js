import React from "react";
import useBankContract from "../utils/useBankContract";
import EnrollAccount from "./EnrollAccount";
import BankAccount from "./BankAccount";
import ShowTransactions from "./ShowTransactions";
import { Flex, Box } from "rimble-ui";

const BankBlock = () => {
  const { isEnrolled } = useBankContract();

  if (!isEnrolled) {
    return <EnrollAccount />;
  }

  return (
    <Flex>
      <Box flex={1}>
        <BankAccount />
        <ShowTransactions />
      </Box>
    </Flex>
  );
};

export default BankBlock;
