import React from "react";
import { Box, Heading } from "rimble-ui";

const Header = () => {
  return (
    <Box bg="primary" p={3} justifyContent="center" flexDirection="column">
      <Box maxWidth="400px" mx="auto">
        <Heading fontSize={4} color={"white"} textAlign={"center"}>
          DollarBank App
        </Heading>
      </Box>
    </Box>
  );
};

export default Header;
