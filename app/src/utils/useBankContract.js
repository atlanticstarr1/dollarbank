import { useMemo } from "react";
import { drizzleReactHooks } from "drizzle-react";

const useBankContract = () => {
  const {
    drizzle,
    useCacheSend,
    useCacheCall,
    useCacheEvents
  } = drizzleReactHooks.useDrizzle();

  const drizzleState = drizzleReactHooks.useDrizzleState(
    drizzleState => drizzleState
  );

  const web3 = drizzle && drizzle.web3;
  const account = drizzleState.accounts[0];
  const contracts = drizzleState.contracts;
  const transactions = drizzleState.transactions;

  let accountBalEth = 0;
  let bankBalanceEth = 0;
  let minBalanceEth = 0;
  let contractBalanceEth = 0;
  let oneUsdEth = 0;
  const accountBalance = drizzleState.accountBalances[account];
  accountBalEth =
    accountBalance && parseFloat(accountBalance / 1e18).toFixed(18);
  const bankBalance = useCacheCall("DollarBank", "getBalance", {
    from: account
  });
  bankBalanceEth = bankBalance && parseFloat(bankBalance / 1e18).toFixed(18);

  // enroll
  const isEnrolled = useCacheCall("DollarBank", "enrolled", account);
  const enrollAccount = useCacheSend("DollarBank", "enroll");

  const deposit = useCacheSend("DollarBank", "deposit");
  const withdraw = useCacheSend("DollarBank", "withdraw");
  const closeAccount = useCacheSend("DollarBank", "closeAccount");

  /* ADMIN */
  const isOwner = useCacheCall("DollarBank", "isOwner", { from: account });

  // get bank accounts
  const bankAccounts = useCacheCall("DollarBank", "getAccounts");

  // contract balance
  const contractBalance = useCacheCall("DollarBank", "getContractBalance", {
    from: account
  });
  contractBalanceEth =
    contractBalance && parseFloat(contractBalance / 1e18).toFixed(4);

  // bank interest rate
  const interestRate = useCacheCall("DollarBank", "interestRate");
  const setInterestRate = useCacheSend("DollarBank", "setInterestRate");
  const payInterest = useCacheSend("DollarBank", "payInterestOwner");

  // bank minumum balance per 10 cents usd
  const minBalance = useCacheCall("DollarBank", "minBalanceEth");
  minBalanceEth = parseFloat(minBalance / 1e18).toFixed(5);
  // 10 cents USD in ETH
  const tenCents = useCacheCall("DollarBank", "tenCents");
  // 1 USD in ETH
  oneUsdEth = tenCents && parseFloat((tenCents * 10) / 1e18).toFixed(5);

  const minBalanceUsd = useCacheCall("DollarBank", "minBalanceUsd");
  const setMinBalance = useCacheSend("DollarBank", "setMinBalance");
  const contractAddress = useCacheCall("DollarBank", "getContractAddress");

  // circuit breaker to start stop interest payments
  const payingInterest = useCacheCall("DollarBank", "interestRunning");
  const startInterest = useCacheSend("DollarBank", "startPayments");
  const stopInterest = useCacheSend("DollarBank", "stopPayments");

  // circuit breaker to pause contract
  const isPaused = useCacheCall("DollarBank", "paused");
  const pauseContract = useCacheSend("DollarBank", "pauseContract");
  const unpauseContract = useCacheSend("DollarBank", "unPauseContract");

  // profile updates via ipfs
  const profilePic = useCacheCall("DollarBank", "getProfilePic");
  const setProfilePic = useCacheSend("DollarBank", "setProfilePic");

  const allEvents = useCacheEvents(
    "DollarBank",
    "allEvents",
    // Use memoization to only recreate listener when account changes.
    useMemo(
      () => ({
        filter: { accountAddress: account },
        fromBlock: 0
      }),
      [account]
    )
  );

  return {
    web3,
    drizzle,
    drizzleState,
    contracts,
    transactions,
    account,
    contractAddress,
    contractBalanceEth,
    accountBalEth,
    isEnrolled,
    enrollAccount,
    bankBalanceEth,
    bankBalance,
    deposit,
    withdraw,
    closeAccount,
    isOwner,
    bankAccounts,
    interestRate,
    payInterest,
    setInterestRate,
    minBalanceEth,
    minBalanceUsd,
    setMinBalance,
    payingInterest,
    startInterest,
    stopInterest,
    isPaused,
    oneUsdEth,
    pauseContract,
    unpauseContract,
    profilePic,
    setProfilePic,
    allEvents
  };
};

export default useBankContract;
