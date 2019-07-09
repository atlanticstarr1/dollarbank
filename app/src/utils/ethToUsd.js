// convert eth to usd
const ethToUsd = (rate, ethBal) => {
  let usdPrice = 0;
  if (rate) usdPrice = parseFloat(ethBal / rate).toFixed(2);
  return usdPrice;
};

export default ethToUsd;
