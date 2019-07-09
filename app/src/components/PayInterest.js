import React from "react";
import { Button } from "rimble-ui";
import useBankContract from "../utils/useBankContract";

const PayInterest = () => {
  const { account, payInterest } = useBankContract();

  const handlePayInterest = () => {
    payInterest.send({ from: account });
  };

  return (
    <Button onClick={handlePayInterest} size={"small"}>
      Pay interest
    </Button>
  );
};
export default PayInterest;
