import React from "react";
import { Flex, Box, QR, PublicAddress } from "rimble-ui";

const AccountOverview = ({ account }) => {
  return (
    <Flex alignItems={"flex-start"}>
      <Flex mr={3}>
        <Flex>
          <QR value={account} size={100} renderAs={"svg"} />
        </Flex>
      </Flex>
      <Box flex={1} mt={3}>
        <PublicAddress address={account} />
      </Box>
    </Flex>
  );
};

export default AccountOverview;
