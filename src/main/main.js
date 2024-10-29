require("dotenv").config();

const solanaWeb3 = require("@solana/web3.js");
const { Connection, clusterApiUrl, PublicKey } = solanaWeb3;

const handleSlot = require("../handler/handleSlot");
const handleTransactionLogs = require("../handler/handleLogs");
const buildAndSendMessage = require("../telegram/messageGenerator");
const getDexInfo = require("../misc/apiCalls");

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

async function createProvider() {
  const message = {};

  for (const address of TARGET_ADDRESSES) {
    const publicKey = new PublicKey(address);

    connection.onLogs(publicKey, async (logs) => {
      console.log(
        `New transaction involving target address ${address} detected:`
      );

      try {
        const currentMessage = { ...message }; // Ensure message is reset for each log
        const handledPlatform = await handleTransactionLogs(
          logs,
          connection,
          currentMessage
        );
        let infoGathered = false;

        if (handledPlatform === "Raydium") {
          infoGathered = await getDexInfo(
            currentMessage.tokenAddress,
            currentMessage,
            false
          );
        } else if (handledPlatform === "PumpFun") {
          // Already handled in handleTx.js
          infoGathered = true;
        }

        if (infoGathered) {
          console.log("Transaction details processed successfully");
          await buildAndSendMessage(currentMessage, "solana", handledPlatform);
        }
      } catch (error) {
        console.error(
          `Error handling transaction logs for address ${address}:`,
          error
        );
      }
    });
  }

  console.log("Solana Listener started...");
}

async function main() {
  createProvider();
}

const TARGET_ADDRESSES = [
  "HLv6yCEpgjQV9PcKsvJpem8ESyULTyh9HjHn9CtqSek1",
  "8MaVa9kdt3NW4Q5HyNAm1X5LbR8PQRVDc1W8NMVK88D5",
];

main();

// Uncomment below for debugging a specific block manually
/*const debugBlockNumber = 297888370;
handleSlot(debugBlockNumber, connection, TARGET_ADDRESSES, true)
  .then(() => console.log(`Finished processing block ${debugBlockNumber}`))
  .catch((error) =>
    console.error(`Error processing block ${debugBlockNumber}:`, error)
  );
*/
