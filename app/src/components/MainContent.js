import React, { useEffect } from "react";
import { Flex, Box } from "rimble-ui";
import useBankContract from "../utils/useBankContract";
import WalletBlock from "./WalletBlock";
import BankBlock from "./BankBlock";
import BankStats from "./BankStats";
import AdminView from "./AdminView";
import Header from "./Header";
import { showTransactionToast } from "../utils/TransactionToastUtil";

const MainContent = () => {
  const { isOwner, drizzleState, contracts, profilePic } = useBankContract();
  const { transactions, transactionStack } = drizzleState;
  useEffect(() => {
    console.log("status messages from main");
    debugger;
    let bankEvents = contracts.DollarBank.events;
    // get last contract event
    let lastbankEvent = bankEvents && bankEvents[bankEvents.length - 1];
    const lastTxId = transactionStack[transactionStack.length - 1];
    let lastTx = transactions[lastTxId];
    if (lastTx) {
      if (lastTx.receipt) {
        // get last transaction event
        let lastTxEvent = Object.values(lastTx.receipt.events)[0];
        lastbankEvent && lastbankEvent.blockNumber >= lastTx.receipt.blockNumber
          ? showTransactionToast(lastbankEvent)
          : showTransactionToast(lastTxEvent || lastTx);
      } else {
        showTransactionToast(lastTx);
      }
    } else if (!lastTxId && lastbankEvent) {
      showTransactionToast(lastbankEvent);
    }
  }, [contracts.DollarBank.events, transactionStack, transactions]);

  return (
    <Flex flexDirection={"column"}>
      <Header profPic={profilePic} />
      <Box flex={1}>
        {isOwner && <AdminView />}
        <BankStats />
        <WalletBlock />
        <BankBlock />
      </Box>
    </Flex>
  );
};

export default MainContent;
