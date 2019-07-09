// Import contracts
import Lighthouse from "./contracts/Lighthouse.json";
import DollarBank from "./contracts/DollarBank.json";

const options = {
  polls: {
    accounts: 3000
  },
  syncAlways: true,
  events: {
    DollarBank: ["allEvents"]
  },
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  },
  contracts: [Lighthouse, DollarBank]
};

export default options;
