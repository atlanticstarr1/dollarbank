import React, { useState } from "react";
import { Flex, Button, Form } from "rimble-ui";
import useBankContract from "../utils/useBankContract";

const EditMinimumBalance = ({ balance }) => {
  const [minBalanceUsd, setMinBalanceUsd] = useState(balance);
  const { setMinBalance } = useBankContract();

  const handleChange = e => {
    e.target.parentNode.classList.add("was-validated");
    setMinBalanceUsd(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMinBalance.send(minBalanceUsd);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Flex flexDirection="column">
        <Form.Field label="Min balance (USD)">
          <Form.Input
            type="number"
            min="1"
            required
            width={1}
            onChange={handleChange}
            value={minBalanceUsd}
          />
        </Form.Field>
        <Button type="submit" size={"small"}>
          Change balance
        </Button>
      </Flex>
    </Form>
  );
};

export default EditMinimumBalance;
