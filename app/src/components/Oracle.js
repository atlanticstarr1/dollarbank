import React from "react";
import { Flex, Box } from "rimble-ui";
import WriteToOracle from "./WriteToOracle";
import OracleSearcher from "./OracleSearcher";

const Oracle = () => {
  return (
    <Flex>
      <Box mr={3}>
        <WriteToOracle />
      </Box>
      <Box>
        <OracleSearcher />
      </Box>
    </Flex>
  );
};

export default Oracle;
