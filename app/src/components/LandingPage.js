import React from "react";
import { Box, Heading, Text } from "rimble-ui";

const LandingPage = () => {
  return (
    <Box flex={1}>
      <Heading.h2 mr={3}>
        <span role="img" aria-label="Waving hand">
          👋
        </span>
      </Heading.h2>
      <Text>
        Welcome to DollarBank. You can deposit ether, make withrawals anytime
        and best of all, earn daily interest on deposits. You only need a
        minimum balance of 1 USD. Connect your wallet to get started.
      </Text>
    </Box>
  );
};

export default LandingPage;
