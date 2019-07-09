import React from "react";
import { Box, Text, Button, Flex, Pill } from "rimble-ui";
import useBankContract from "../utils/useBankContract";

const PauseContract = () => {
  const { isPaused, pauseContract, unpauseContract } = useBankContract();

  const togglePauseContract = () => {
    isPaused ? unpauseContract.send() : pauseContract.send();
  };

  return (
    <Flex flexDirection="column">
      <Box mb={3}>
        <Text fontSize={"14px"} fontWeight={600} mb={3}>
          Circuit Breaker
        </Text>
        <Pill color={isPaused ? "danger" : "green"} mb={2}>
          {isPaused ? "DISABLED" : "ACTIVE"}
        </Pill>
      </Box>
      <Box>
        <Button
          variant={!isPaused && "danger"}
          onClick={togglePauseContract}
          size={"small"}
        >
          {isPaused ? "Unpause Contract" : "Pause Contract"}
        </Button>
      </Box>
    </Flex>
  );
};
export default PauseContract;
