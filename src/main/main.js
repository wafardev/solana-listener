require("dotenv").config();

const solanaWeb3 = require("@solana/web3.js");
const { Connection, clusterApiUrl, PublicKey } = solanaWeb3;

const handleSlot = require("../handler/handleSlot");
const handleTransactionLogs = require("../handler/handleLogs");
const buildAndSendMessage = require("../telegram/messageGenerator");
const getTokenInfo = require("../misc/apiCalls");

const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// Error handling for uncaught exceptions and promise rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("exit", (code) => {
  console.log(
    code === 0
      ? "Process exited peacefully."
      : `Process exited with code: ${code}`
  );
});

function createProvider() {
  let message = {};
  const publicKey = new PublicKey(TARGET_ADDRESS);

  connection.onLogs(publicKey, async (logs) => {
    console.log("New transaction involving target address detected:");
    try {
      if (
        (await handleTransactionLogs(logs, connection, message)) &&
        (await getTokenInfo(message.tokenAddress, message))
      ) {
        console.log("Transaction details processed successfully");
        await buildAndSendMessage(message, "solana");
      }
    } catch (error) {
      console.error("Error handling transaction logs:", error);
    }
  });

  console.log("Solana Listener started...");
}

async function main() {
  createProvider();
}

//const TARGET_ADDRESS = "DoQMWf3Sm1uWeHSL3Heou4Uc1LwgmscAkhFvyZbuuHeH";
const TARGET_ADDRESS = "HLv6yCEpgjQV9PcKsvJpem8ESyULTyh9HjHn9CtqSek1";

main();

// Uncomment below for debugging a specific block manually
/*
const debugBlockNumber = 297618646;
handleSlot(debugBlockNumber, connection, TARGET_ADDRESS)
  .then(() => console.log(`Finished processing block ${debugBlockNumber}`))
  .catch((error) =>
    console.error(`Error processing block ${debugBlockNumber}:`, error)
  );
*/
