//use infura.io node so we don't have to run an ipfs daemon on our machine
import IPFS from "ipfs-api";
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

export default ipfs;
