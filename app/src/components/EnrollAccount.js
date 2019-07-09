import React from "react";
import { Heading, Box, Text, Button, Card } from "rimble-ui";
import useBankContract from "../utils/useBankContract";

const EnrollAccount = () => {
  const { account, enrollAccount } = useBankContract();

  const handleEnroll = () => {
    enrollAccount.send({ from: account });
  };

  return (
    <Card width={"450px"} mx={"auto"} px={4}>
      <Heading>Enroll Account</Heading>
      <Box>
        <Text mb={3}>Make deposits, withdrawals, and earn daily interest.</Text>
      </Box>
      <Button onClick={handleEnroll}>Enroll</Button>
    </Card>
  );
};
export default EnrollAccount;
