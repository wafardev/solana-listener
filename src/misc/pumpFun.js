const fetchTokenMetadata = require("./rpcCalls");

async function getPumpFunData(tx, signer, connection, message) {
  const LAMPORTS_PER_SOL = 1_000_000_000;
  let pumpFunBondingAddress = "";
  let accountIndex = -1;
  let tokenAmount = 0;
  let solAmount = 0;

  const postTokenBalances = tx.meta?.postTokenBalances || [];
  const postBalances = tx.meta?.postBalances || [];

  for (const postTokenBalance of postTokenBalances) {
    if (postTokenBalance.owner !== signer) {
      pumpFunBondingAddress = postTokenBalance.owner;
      accountIndex = postTokenBalance.accountIndex;
      tokenAmount = postTokenBalance.uiTokenAmount.uiAmount || 0;
      break;
    }
  }

  for (const postBalance of postBalances) {
    if (postBalance.accountIndex === accountIndex) {
      solAmount = Math.abs(postBalance) / LAMPORTS_PER_SOL;
      break;
    }
  }

  // uncompleted
  const tokenMetadata = await fetchTokenMetadata(
    connection,
    pumpFunBondingAddress
  );
  console.log(tokenMetadata);

  message.pairAddress = pumpFunBondingAddress;
  message.volume = null;
  message.liquidity = null;
  message.marketcap = null;
  message.socialLinks = null;
  message.symbol = null;
  message.name = null;
  message.priceUsd = null;

  /*Object.assign(message, {
    volume,
    liquidity,
    marketcap,
    socialLinks,
    pairAddress,
    symbol,
    name,
    priceUsd,
  });*/
}

module.exports = getPumpFunData;
