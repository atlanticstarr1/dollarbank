import React, { useState } from "react";
import { Flex, Button, Form, Text } from "rimble-ui";
import useOracle from "../utils/useOracle";

const OracleSearcher = () => {
  const [seeker, setSeeker] = useState("");
  const { changeSearcher } = useOracle();

  const handleChange = e => {
    e.target.parentNode.classList.add("was-validated");
    setSeeker(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    changeSearcher.send(seeker);
  };

  return (
    <>
      <Text>Contract to be alerted when lighhouse data changes.</Text>
      <Form onSubmit={handleSubmit}>
        <Flex flexDirection="column">
          <Form.Field label="Searcher address">
            <Form.Input
              type="text"
              required
              width={1}
              onChange={handleChange}
              value={seeker}
            />
          </Form.Field>
          <Button size={"small"} type="submit">
            Set address
          </Button>
        </Flex>
      </Form>
    </>
  );
};

export default OracleSearcher;
