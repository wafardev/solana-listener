const { sendMessage } = require("./telegramHandler");
const getSolPrice = require("../misc/getSolPrice");

async function buildAndSendMessage(messageObject, chain, platform) {
  console.log(messageObject);
  const SOL_PRICE = await getSolPrice();
  const formatCurrency = (amount) => {
    if (amount === 0 || !amount) return "0";
    return amount.toLocaleString("en-US");
  };

  let explorer;
  if (chain === "solana") {
    explorer = "solscan.io";
  }

  messageObject.photon = `<a href="https://photon-sol.tinyastro.io/en/lp/${messageObject.pairAddress}">Photon</a>`;
  messageObject.chart = `<a href="https://dexscreener.com/${chain}/${messageObject.tokenAddress}">Chart</a>`;
  messageObject.tx = `<a href="https://${explorer}/tx/${messageObject.signature}">Hash</a>`;
  messageObject.token = `<b>🪙 Token:</b> <i>${messageObject.name} (${messageObject.symbol})</i>`;
  messageObject.tokenAmount = `🔄 <b>Amount:</b> <i>${formatCurrency(
    messageObject.tokenAmount
  )} ${messageObject.symbol}</i> ($${formatCurrency(
    messageObject.solAmount * SOL_PRICE
  )})`;
  messageObject.wallet = `<b>💸 Wallet Address:</b> <code>${messageObject.signer}</code>`;
  messageObject.value = `💰 <b>Value Transacted (SOL):</b> <i>${formatCurrency(
    messageObject.solAmount
  )} SOL</i>`;
  messageObject.type = `📊 <b>Transaction Type:</b> <i>${messageObject.type} (${messageObject.platform})</i>`;
  messageObject.price = `📈 <b>Price per ${messageObject.symbol}:</b> <i>$${messageObject.priceUsd}</i>`;

  if (platform === "Raydium") {
    if (messageObject.type === "Sell") {
      messageObject.buy = `💎 <a href="https://raydium.io/swap/?inputMint=${messageObject.tokenAddress}&outputMint=sol">Raydium</a>`;
    } else {
      messageObject.buy = `💎 <a href="https://raydium.io/swap/?inputMint=sol&outputMint=${messageObject.tokenAddress}">Raydium</a>`;
    }
  } else if (platform === "PumpFun") {
    messageObject.buy = `💊 <a href="https://pump.fun/${messageObject.tokenAddress}">PumpFun</a>`;
    messageObject.chart = `<a href="https://photon-sol.tinyastro.io/en/lp/${messageObject.pairAddress}">Chart</a>`;
  }

  if (
    !Array.isArray(messageObject.socialLinks) ||
    messageObject.socialLinks.length === 0
  ) {
    console.log("No social links found.");
    messageObject.socialLinks = "🔗 <b>No social links found.</b>";
  } else {
    messageObject.socialLinks = messageObject.socialLinks
      .map((socialObject) => {
        if (socialObject.type === "telegram")
          return `<a href="${socialObject.url}">📬 Telegram</a>`;
        if (socialObject.type === "twitter")
          return `<a href="${socialObject.url}">🐦 Twitter</a>`;
        return `<a href="${socialObject.url}">🌐 Other</a>`;
      })
      .join(" | ");
  }

  const message = `🚨 <b>COPYTRADING ALERT FOR WALLET</b> 🚨

${messageObject.token}
${messageObject.type}
${messageObject.tokenAmount}

${messageObject.wallet}
${messageObject.value}

<b>Market Information:</b>
${messageObject.price}
📊 <b>Market Cap:</b> <i>$${formatCurrency(
    messageObject.marketcap
  )}</i> | 💧 <b>Liquidity:</b> <i>$${formatCurrency(
    messageObject.liquidity
  )}</i> | 🏦 <b>Volume:</b> <i>$${formatCurrency(messageObject.volume)}</i>

⚛️ ${messageObject.photon} | ${messageObject.buy} | 📈 ${
    messageObject.chart
  } | 🔍 ${messageObject.tx}

${messageObject.socialLinks}`;

  //console.log(message);
  try {
    console.log("Sending message...");
    await sendMessage(message);
    console.log("Message sent successfully.");
  } catch (error) {
    console.error("Error sending message:", error.message || error);
  }
}

module.exports = buildAndSendMessage;
