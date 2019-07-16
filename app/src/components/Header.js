import React, { useState } from "react";
import { Avatar, Box, Heading, Flex, Button } from "rimble-ui";
import Profile from "./Profile";

const Header = ({ profPic }) => {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  // set default prof pic; dogeee!! shiba inu
  if (!profPic) {
    profPic = "QmYjh5NsDc6LwU3394NbB42WpQbGVsueVSBmod5WACvpte";
  }
  return (
    <>
      <Flex bg="primary" p={1} justifyContent="center" mb={3}>
        <Box flex={1} mt={1}>
          <Heading fontSize={4} color={"white"} textAlign={"center"}>
            DollarBank App
          </Heading>
        </Box>
        <Box mt={1}>
          <Button.Text size="small" onClick={toggleProfile}>
            <Avatar src={`https://gateway.ipfs.io/ipfs/` + profPic} />
          </Button.Text>
        </Box>
      </Flex>
      {showProfile && <Profile />}
    </>
  );
};

export default Header;
