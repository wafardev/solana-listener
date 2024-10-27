const { PublicKey } = require("@solana/web3.js");
const { Metadata } = require("@metaplex-foundation/mpl-token-metadata");

async function fetchTokenMetadata(connection, mintAddress) {
  const metadataPDA = await Metadata.getPDA(new PublicKey(mintAddress));
  const metadata = await Metadata.load(connection, metadataPDA);
  const {
    data: { name, symbol },
  } = metadata;
  return { name, symbol };
}

module.exports = fetchTokenMetadata;
