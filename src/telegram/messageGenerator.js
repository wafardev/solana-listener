const { sendMessage } = require("./telegramHandler");

async function buildAndSendMessage(messageObject, chain) {
  const SOL_PRICE = 170;
  const formatCurrency = (amount) => amount.toLocaleString("en-US");

  let explorer;
  if (chain === "solana") {
    explorer = "solscan.io";
  }

  if (messageObject.type === "Sell") {
    messageObject.raydium = `<a href="https://raydium.io/swap/?inputMint=${messageObject.tokenAddress}&outputMint=sol">Raydium</a>`;
  } else {
    messageObject.raydium = `<a href="https://raydium.io/swap/?inputMint=sol&outputMint=${messageObject.tokenAddress}">Raydium</a>`;
  }

  messageObject.photon = `<a href="https://photon-sol.tinyastro.io/en/lp/${messageObject.pairAddress}">Photon</a>`;
  messageObject.chart = `<a href="https://dexscreener.com/${chain}/${messageObject.tokenAddress}">Chart</a>`;
  messageObject.tx = `<a href="https://${explorer}/tx/${messageObject.signature}">Hash</a>`;
  messageObject.token = `<b>🪙 Token:</b> <i>${messageObject.name} (${messageObject.symbol})</i>`;
  messageObject.tokenAmount = `🔄 <b>Amount:</b> <i>${
    messageObject.tokenAmount
  } ${messageObject.symbol}</i> ($${formatCurrency(
    messageObject.solAmount * SOL_PRICE
  )})`;
  messageObject.tokenAddress = `🏷️ <b>Token Address</b>: <code>${messageObject.tokenAddress}</code>`;
  messageObject.wallet = `<b>💸 Wallet Address:</b> <code>${messageObject.signer}</code>`;
  messageObject.value = `💰 <b>Value Transacted (SOL):</b> <i>${messageObject.solAmount} SOL</i>`;
  messageObject.type = `📊 <b>Transaction Type:</b> <i>${messageObject.type}</i>`;
  messageObject.price = `📈 <b>Price per ${messageObject.symbol}:</b> <i>$${messageObject.priceUsd}</i>`;

  messageObject.socialLinks = messageObject.socialLinks
    ? messageObject.socialLinks
        .map((socialObject) => {
          if (socialObject.type === "telegram")
            return `<a href="${socialObject.url}">📬 Telegram</a>`;
          if (socialObject.type === "twitter")
            return `<a href="${socialObject.url}">🐦 Twitter</a>`;
          return `<a href="${socialObject.url}">🌐 Website</a>`;
        })
        .join(" | ")
    : "🔗 <b>No social links found.</b>";

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

⚛️ ${messageObject.photon} | 💎 ${messageObject.raydium} | 📈 ${
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
