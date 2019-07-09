import React, { useState } from "react";
import { Flex, Box, ToastMessage, MetaMaskButton } from "rimble-ui";
import ConnectWallet from "./ConnectWallet";
import LandingPage from "./LandingPage";

const AppContainer = () => {
  const [connect, setConnect] = useState(false);
  const connectWallet = () => setConnect(true);

  const renderContent = () => {
    if (connect) {
      return <ConnectWallet />;
    } else {
      return (
        <MetaMaskButton onClick={connectWallet} width={1 / 2} my={3}>
          Connect with MetaMask
        </MetaMaskButton>
      );
    }
  };

  return (
    <Flex maxWidth={"800px"} mx={"auto"} p={3}>
      <Box flex={1}>
        {!connect && <LandingPage />}
        {renderContent()}
        <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
      </Box>
    </Flex>
  );
};

export default AppContainer;
