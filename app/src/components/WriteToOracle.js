import React, { useState,useEffect } from "react";
import { Flex, Box, Button, Form, Text } from "rimble-ui";
import useOracle from "../utils/useOracle";

const WriteToOracle = () => {
  const [price, setPrice] = useState(0);
  const { value, write } = useOracle();

  const handleChange = e => {
    e.target.parentNode.classList.add("was-validated");
    setPrice(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const nonce = Math.floor(Math.random() * 1000);
    write.send(price, nonce);
  };

  // START OF DEMO
  // DEMO PURPOSES ONLY - THE ORACLE WILL UPDATE ITS DATA ONCE PER 30 SECONDS. IN REALITY
  // THIS WILL BE A DAY
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const nonce = Math.floor(Math.random() * 1000);
  //     write.send(price, nonce);
  //   }, 60000);

  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // END OF DEMO

  const ethprice = parseFloat(value / 1e18).toFixed(5);
  return (
    <div>
      <Box>
        <Text>Ten cents (USD) worth of ETH</Text>
      </Box>
      <Form onSubmit={handleSubmit}>
        <Flex flexDirection="column">
          <Form.Field label="Price (wei)">
            <Form.Input
              type="number"
              step="any"
              min="1"
              max={1e18}
              required
              width={1}
              onChange={handleChange}
              value={price}
            />
          </Form.Field>
          <Button size={"small"} type="submit">
            Update price
          </Button>
          <Box my={3}>
            <Text fontSize={"1.3rem"} fontWeight={1} textAlign={"center"}>
              {value} wei
            </Text>
            <Text textAlign={"center"}>(~{ethprice} ETH)</Text>
          </Box>
        </Flex>
      </Form>
    </div>
  );
};

export default WriteToOracle;
