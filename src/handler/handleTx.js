const getPumpFunData = require("../misc/pumpFun");

async function handleTx(tx, signer, platform, message, connection) {
  try {
    const LAMPORTS_PER_SOL = 1_000_000_000;

    let solAmount = 0;
    let tokenAddress = "";
    let tokenAmount = 0;
    const preBalance = tx.meta?.preBalances[0] || 0;
    const postBalance = tx.meta?.postBalances[0] || 0;
    const preTokenBalances = tx.meta?.preTokenBalances || [];
    const postTokenBalances = tx.meta?.postTokenBalances || [];

    const boughtBool = preBalance > postBalance;
    solAmount = Math.abs(preBalance - postBalance) / LAMPORTS_PER_SOL;

    let tokenAmountBefore = 0;
    let accountIndex = -1;

    // Locate token balance and address in preTokenBalances
    for (const preTokenBalance of preTokenBalances) {
      if (preTokenBalance.owner === signer) {
        tokenAddress = preTokenBalance.mint;
        accountIndex = preTokenBalance.accountIndex;
        tokenAmountBefore = preTokenBalance.uiTokenAmount.uiAmount || 0;
        break;
      }
    }

    for (const postTokenBalance of postTokenBalances) {
      const isSameAccount =
        accountIndex === -1 || postTokenBalance.accountIndex === accountIndex;

      if (postTokenBalance.owner === signer && isSameAccount) {
        const postTokenAmount = postTokenBalance.uiTokenAmount.uiAmount || 0;
        tokenAmount = Math.abs(postTokenAmount - tokenAmountBefore);

        if (!tokenAddress) {
          tokenAddress = postTokenBalance.mint;
        }
        break;
      }
    }
    if (platform === "PumpFun") {
      await getPumpFunData(tx, signer, connection, message);
    }
    console.log(
      `${
        boughtBool ? "Buy" : "Sell"
      } detected on ${platform}: SOL Amount - ${solAmount}, Token Address - ${tokenAddress}, Token Amount - ${tokenAmount}`
    );

    message.tokenAddress = tokenAddress;
    message.tokenAmount = tokenAmount;
    message.solAmount = solAmount;
    message.type = boughtBool ? "Buy" : "Sell";

    return true;
  } catch (error) {
    console.error("Error handling transaction logs:", error);
    return false;
  }
}

module.exports = handleTx;
