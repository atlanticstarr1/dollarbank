import React from "react";
import { Card, Flex, Box, Heading } from "rimble-ui";
import useBankContract from "../utils/useBankContract";

import AccountOverview from "./AccountOverview";
import ShowBankBalance from "./ShowBankBalance";

const WalletBlock = () => {
  const { account, accountBalEth } = useBankContract();
  return (
    <Card mb={1}>
      <Flex>
        <Box flex={1 / 2}>
          <Heading.h4>Your Wallet</Heading.h4>
        </Box>
        <Box alignSelf={"center"} my={3}>
          <ShowBankBalance balanceEth={accountBalEth} />
        </Box>
      </Flex>
      <AccountOverview account={account} />
    </Card>
  );
};

export default WalletBlock;
