import React from "react";
import { Flex, Box, QR, PublicAddress } from "rimble-ui";

const AccountOverview = ({ account }) => {
  return (
    <Flex mr={3} alignItems={"flex-start"}>
      <Box mr={3}>
        <QR value={account} size={100} renderAs={"svg"} />
      </Box>
      <Box flex={1} mt={3}>
        <PublicAddress address={account} width={1} />
      </Box>
    </Flex>
  );
};

export default AccountOverview;
