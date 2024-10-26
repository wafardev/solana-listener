const axios = require("axios");

async function getTokenInfo(tokenAddress, message) {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    );

    const pair = response.data?.pairs?.[0];
    if (!pair) {
      throw new Error("No pairs found for the given token address");
    }

    const {
      info = {},
      baseToken: { symbol, name } = {},
      pairAddress,
      volume: { h24: volume } = {},
      liquidity: { usd: liquidity } = {},
      marketCap: marketcap,
      priceUsd: priceUsd,
    } = pair;

    const socialLinks = [
      ...((info.websites && info.websites.slice(0, 1)) || []),
      ...(info.socials || []),
    ];

    Object.assign(message, {
      volume,
      liquidity,
      marketcap,
      socialLinks,
      pairAddress,
      symbol,
      name,
      priceUsd,
    });

    //console.log(pair);
    return true;
  } catch (error) {
    console.error("Error fetching paired address:", error.message);
    return false;
  }
}

module.exports = getTokenInfo;
