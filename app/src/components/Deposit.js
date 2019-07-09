import React, { useState } from "react";
import { Flex, Button, Form } from "rimble-ui";
import useBankContract from "../utils/useBankContract";

const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState(0);
  const { account, accountBalEth, deposit } = useBankContract();

  const handleChange = e => {
    e.target.parentNode.classList.add("was-validated");
    setDepositAmount(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const weiValue = depositAmount * 1e18;
    deposit.send({ from: account, value: weiValue });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Flex flexDirection="column">
          <Form.Field label="Amount (ETH)">
            <Form.Input
              type="number"
              step="any"
              min="0.000000000000000001"
              max={accountBalEth}
              width={1}
              required
              onChange={handleChange}
              value={depositAmount}
              title="Enter amount of ETH to deposit"
            />
          </Form.Field>
          <Button type="submit">Deposit</Button>
        </Flex>
      </Form>
    </div>
  );
};

export default Deposit;
