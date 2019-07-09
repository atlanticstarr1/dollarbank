import React, { useEffect } from "react";
import { Flex, Box } from "rimble-ui";
import useBankContract from "../utils/useBankContract";
import WalletBlock from "./WalletBlock";
import BankBlock from "./BankBlock";
import BankStats from "./BankStats";
import AdminView from "./AdminView";
import { showTransactionToast } from "../utils/TransactionToastUtil";

const MainContent = () => {
  const { isOwner, drizzleState, contracts } = useBankContract();
  const { transactions, transactionStack } = drizzleState;
  useEffect(() => {
    console.log("status messages from main");
    debugger;
    let events = contracts.DollarBank.events.filter(
      a => a.event === "InterestPaid" || a.event === "OracleDataNotValid"
    );
    let lastEvent = events && events[events.length - 1];
    const lastTxId = transactionStack[transactionStack.length - 1];
    let lastTx = transactions[lastTxId];
    if (lastTx) {
      if (lastTx.status === "error") {
        showTransactionToast(null, lastTx);
        return;
      }
      let eventBlock = lastEvent ? lastEvent.blockNumber : -1;
      let isNewer = lastTx.receipt.blockNumber >= eventBlock;
      if (isNewer) showTransactionToast(null, lastTx);
      else showTransactionToast(lastEvent, null);
    } else if (!lastTxId && lastEvent) {
      showTransactionToast(lastEvent, null);
    }
  }, [contracts.DollarBank.events, transactionStack, transactions]);

  return (
    <Flex flexDirection={"column"}>
      {isOwner && (
        <Box flex={1} mb={1}>
          <AdminView />
        </Box>
      )}
      <Box flex={1}>
        <BankStats />
        <WalletBlock />
        <BankBlock />
      </Box>
    </Flex>
  );
};

export default MainContent;
