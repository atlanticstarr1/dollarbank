import TransactionToastMessages from "./TransactionToastMessages";

export const showTransactionToast = (event, tx) => {
  debugger;
  let toastMeta;
  if (tx) {
    const { status, error, receipt } = tx;
    toastMeta = getTransactionToastMeta(status);
    if (error) {
      let errMsgs =
        error.message.search("revert") >= 0
          ? error.message.split("revert")
          : error.message.split("Error: ");
      let errMsg = errMsgs[errMsgs.length - 1];
      toastMeta.message = "Transaction failed";
      toastMeta.secondaryMessage = errMsg.trim();
    } else if (status === "success") {
      const {
        Withdrawn,
        Deposited,
        Enrolled,
        ClosedAccount,
        InterestStarted,
        InterestStopped,
        InterestPaid,
        Paused,
        Unpaused
      } = receipt.events;
      if (Withdrawn) {
        const amount = parseFloat(Withdrawn.returnValues[1] / 1e18).toFixed(4);
        const remaining = parseFloat(Withdrawn.returnValues[2] / 1e18).toFixed(
          4
        );
        toastMeta.message = `Withdrawn ${amount}`;
        toastMeta.secondaryMessage = `You have ${remaining} ETH remaining.`;
      } else if (Deposited) {
        const amount = parseFloat(Deposited.returnValues[1] / 1e18).toFixed(4);
        toastMeta.message = `Deposited`;
        toastMeta.secondaryMessage = `You deposited ${amount} ETH.`;
      } else if (Enrolled) {
        toastMeta.message = `Enrolled`;
        toastMeta.secondaryMessage = `Your account is enrolled.`;
      } else if (ClosedAccount) {
        const amt = parseFloat(ClosedAccount.returnValues[1] / 1e18).toFixed(4);
        toastMeta.message = `Account closed`;
        toastMeta.secondaryMessage = `Balance of ${amt} ETH sent to wallet.`;
      } else if (InterestStarted) {
        toastMeta.message = `Interest started`;
        toastMeta.secondaryMessage = `Interest payments resumed.`;
      } else if (InterestStopped) {
        toastMeta.message = `Interest stopped`;
        toastMeta.secondaryMessage = `Interest payments stopped.`;
        toastMeta.variant = "failure";
      } else if (InterestPaid) {
        toastMeta.message = `Interest paid`;
        toastMeta.secondaryMessage = `Check your balance`;
      } else if (Paused) {
        toastMeta.message = `Contract paused`;
        toastMeta.secondaryMessage = `Only withdrawals are allowed.`;
        toastMeta.variant = "failure";
      } else if (Unpaused) {
        toastMeta.message = `Contract unpaused`;
        toastMeta.secondaryMessage = `All features re-enabled`;
      }
    }
  } else if (event) {
    let status = event.blockHash === null ? "pending" : "success";
    toastMeta = getTransactionToastMeta(status);
    if (event.event === "OracleDataNotValid") {
      toastMeta.message = `Oracle error`;
      toastMeta.secondaryMessage = `Oracle data not valid.`;
      toastMeta.variant = "failure";
    } else if (event.event === "InterestPaid") {
      toastMeta.message = `Interest paid`;
      toastMeta.secondaryMessage = `Check your balance`;
    }
  }

  // Show toast
  window.toastProvider.addMessage(".", toastMeta);
};

const getTransactionToastMeta = txStatus => {
  let transactionToastMeta = {};
  let toastMsg = {};

  switch (txStatus) {
    case "initialized":
      transactionToastMeta = TransactionToastMessages.initialized;
      break;
    case "started":
      transactionToastMeta = TransactionToastMessages.started;
      break;
    case "pending":
      transactionToastMeta = TransactionToastMessages.pending;
      break;
    case "confirmed":
      transactionToastMeta = TransactionToastMessages.confirmed;
      break;
    case "success":
      transactionToastMeta = TransactionToastMessages.success;
      break;
    case "error":
      transactionToastMeta = TransactionToastMessages.error;
      break;
    default:
      break;
  }
  // Copy toast message structure
  Object.assign(toastMsg, transactionToastMeta);
  return toastMsg;
};
