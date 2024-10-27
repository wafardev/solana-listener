const getDexInfo = require("./apiCalls");

async function getSolPrice() {
  const SOL_ADDRESS = "0xD31a59c85aE9D8edEFeC411D448f90841571b89c";
  const SOL_PRICE = await getDexInfo(SOL_ADDRESS, {}, true);

  return SOL_PRICE;
}

module.exports = getSolPrice;
