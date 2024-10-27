const fetchTokenMetadata = require("./rpcCalls");
const getSolPrice = require("./getSolPrice");

async function getPumpFunData(tx, signer, connection, message) {
  const LAMPORTS_PER_SOL = 1_000_000_000;
  let pumpFunBondingAddress = "";
  let tokenAddress = "";
  let accountIndex = -1;
  let tokenAmount = 0;
  let solBalance = 0;

  const postTokenBalances = tx.meta?.postTokenBalances || [];
  const postBalances = tx.meta?.postBalances || [];

  for (const postTokenBalance of postTokenBalances) {
    if (postTokenBalance.owner !== signer) {
      pumpFunBondingAddress = postTokenBalance.owner;
      tokenAddress = postTokenBalance.mint;
      accountIndex = postTokenBalance.accountIndex;
      tokenAmount = postTokenBalance.uiTokenAmount.uiAmount || 0;
      break;
    }
  }

  for (const postBalance of postBalances) {
    if (postBalance.accountIndex === accountIndex) {
      solBalance = postBalance / LAMPORTS_PER_SOL;
      break;
    }
  }

  const tokenMetadata = await fetchTokenMetadata(connection, tokenAddress);

  const solPrice = await getSolPrice();

  const usdPrice = (solBalance / tokenAmount) * solPrice;
  const marketCap = LAMPORTS_PER_SOL * usdPrice;
  const liquidity = solBalance * solPrice * 2;

  message.pairAddress = pumpFunBondingAddress;
  message.volume = null;
  message.liquidity = liquidity;
  message.marketcap = marketCap;
  message.socialLinks = null;
  message.symbol = tokenMetadata.tokenSymbol;
  message.name = tokenMetadata.tokenName;
  message.priceUsd = usdPrice;

  console.log(message);
}

module.exports = getPumpFunData;
