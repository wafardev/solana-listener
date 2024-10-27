const { Metaplex } = require("@metaplex-foundation/js");
const { PublicKey } = require("@solana/web3.js");

async function fetchTokenMetadata(connection, mintAddress) {
  const metaplex = Metaplex.make(connection);

  const publicAddress = new PublicKey(mintAddress);

  let tokenName;
  let tokenSymbol;

  const metadataAccount = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: publicAddress });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

  if (metadataAccountInfo) {
    const token = await metaplex
      .nfts()
      .findByMint({ mintAddress: publicAddress });
    tokenName = token.name;
    tokenSymbol = token.symbol;
  }

  return { tokenName, tokenSymbol };
}

module.exports = fetchTokenMetadata;
