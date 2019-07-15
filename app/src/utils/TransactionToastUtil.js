import TransactionToastMessages from "./TransactionToastMessages";

export const showTransactionToast = lastEvent => {
  debugger;
  let { status, error, id } = lastEvent;
  if (id && id.indexOf("log_") > -1) status = "success";
  let toastMeta = getTransactionToastMeta(status);
  // error
  if (error) {
    let errMsgs =
      error.message.search("revert") >= 0
        ? error.message.split("revert")
        : error.message.search("Error: ") >= 0
        ? error.message.split("Error: ")
        : error.message.split("message");
    let errMsg = errMsgs[errMsgs.length - 1];
    toastMeta.message = "Transaction failed";
    toastMeta.secondaryMessage = errMsg.trim();
    // sucess
  } else if (status === "success") {
    const { event, returnValues } = lastEvent;
    if (event === "Withdrawn") {
      const amount = parseFloat(returnValues[1] / 1e18).toFixed(4);
      const remaining = parseFloat(returnValues[2] / 1e18).toFixed(4);
      toastMeta.message = `Withdrawn ${amount}`;
      toastMeta.secondaryMessage = `You have ${remaining} ETH remaining.`;
    } else if (event === "Deposited") {
      const amount = parseFloat(returnValues[1] / 1e18).toFixed(4);
      toastMeta.message = `Deposited`;
      toastMeta.secondaryMessage = `You deposited ${amount} ETH.`;
    } else if (event === "Enrolled") {
      toastMeta.message = `Enrolled`;
      toastMeta.secondaryMessage = `Your account is enrolled.`;
    } else if (event === "ClosedAccount") {
      const amt = parseFloat(returnValues[1] / 1e18).toFixed(4);
      toastMeta.message = `Account closed`;
      toastMeta.secondaryMessage = `Balance of ${amt} ETH sent to wallet.`;
    } else if (event === "InterestStarted") {
      toastMeta.message = `Interest started`;
      toastMeta.secondaryMessage = `Interest payments resumed.`;
    } else if (event === "InterestStopped") {
      toastMeta.message = `Interest stopped`;
      toastMeta.secondaryMessage = `Interest payments stopped.`;
      toastMeta.variant = "failure";
    } else if (event === "InterestPaid") {
      toastMeta.message = `Interest paid`;
      toastMeta.secondaryMessage = `Check your balance`;
    } else if (event === "Paused") {
      toastMeta.message = `Contract paused`;
      toastMeta.secondaryMessage = `Only withdrawals are allowed.`;
      toastMeta.variant = "failure";
    } else if (event === "Unpaused") {
      toastMeta.message = `Contract unpaused`;
      toastMeta.secondaryMessage = `All features re-enabled`;
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
