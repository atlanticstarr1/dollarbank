import React from "react";
import { Drizzle } from "drizzle";
import { drizzleReactHooks } from "drizzle-react";
import options from "../drizzleOptions";
import MainContent from "./MainContent";
import { LoadStatus, LoadError } from "./Loading";

const ConnectWallet = () => {
  const drizzle = new Drizzle(options);
  return (
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
      <drizzleReactHooks.Initializer
        error={<LoadError />}
        loadingContractsAndAccounts={
          <LoadStatus message="Loading contracts and accounts" />
        }
        loadingWeb3={<LoadStatus message="Loading web3" />}
      >
        <MainContent />
      </drizzleReactHooks.Initializer>
    </drizzleReactHooks.DrizzleProvider>
  );
};

export default ConnectWallet;
