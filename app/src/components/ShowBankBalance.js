import React, { useState, useMemo } from "react";
import useBankContract from "../utils/useBankContract";
import { Flex, Box, Text } from "rimble-ui";
import ethToUsd from "../utils/ethToUsd";

const ShowBankBalance = ({ balanceEth }) => {
  const [balUsd, setBalUsd] = useState(0);
  const { oneUsdEth } = useBankContract();

  const calculateUsd = async () => {
    console.log("calling getbalance");
    const usdPrice = ethToUsd(oneUsdEth, balanceEth);
    setBalUsd(usdPrice);
  };

  useMemo(calculateUsd, [balanceEth, oneUsdEth]);

  return (
    <Flex flexDirection={"column"}>
      <Box flex={1}>
        <Text
          fontSize={"2rem"}
          fontWeight={1}
          lineHeight={0.5}
          textAlign={"center"}
          mb={3}
        >
          {balanceEth} ETH
        </Text>
      </Box>
      <Box flex={1}>
        <Text textAlign={"center"}>(~ ${balUsd} USD)</Text>
      </Box>
    </Flex>
  );
};
export default ShowBankBalance;
