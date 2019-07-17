import React, { useState } from "react";
import ipfs from "../utils/ipfs";
import useBankContract from "../utils/useBankContract";
import { Button, Flex, Form, Loader } from "rimble-ui";

const Profile = () => {
  const [buffer, setBuffer] = useState("");
  const [saving, setSaving] = useState(false);
  const { setProfilePic, account } = useBankContract();

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    // save file to ipfs
    await ipfs.add(buffer, (err, hash) => {
      const ipfsHash = hash[0].hash;
      setProfilePic.send(ipfsHash, { from: account });
      setSaving(false);
    });
  };

  const handleImageChange = e => {
    e.stopPropagation();
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => convertToBuffer(reader);
  };

  const convertToBuffer = async reader => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    setBuffer(buffer);
  };

  return (
    <Flex mb={3} alignSelf={"flex-end"}>
      <Form onSubmit={handleSubmit}>
        <Flex alignItems={"center"}>
          <Form.Input type="file" width={1} onChange={handleImageChange} />
          <Button
            type="submit"
            icon="Save"
            disabled={buffer.length === 0 || saving}
          >
            {saving ? <Loader color="white" /> : "Save"}
          </Button>
        </Flex>
      </Form>
    </Flex>
  );
};

export default Profile;
