const processTransaction = require("./processTx");
const buildAndSendMessage = require("../telegram/messageGenerator");
const getDexInfo = require("../misc/apiCalls");

async function waitForFinalizedBlock(slot, connection) {
  const delay = 2000; // Delay between checks in milliseconds

  while (true) {
    try {
      const block = await connection.getBlock(slot, {
        commitment: "finalized",
        maxSupportedTransactionVersion: 0,
      });

      if (block) {
        console.log(`Slot ${slot} is finalized.`);
        return block;
      }
    } catch (error) {
      console.log(`Block not finalized for slot ${slot}. Retrying...`);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

async function handleSlot(slot, connection, targetAddresses, messageBool) {
  console.log(`Waiting for slot ${slot} to be finalized...`);

  const block = await waitForFinalizedBlock(slot, connection);
  console.log(`Processing finalized slot: ${slot}`);

  if (!block.transactions) {
    console.log(`No transactions found for finalized slot ${slot}`);
    return;
  }

  for (const targetAddress of targetAddresses) {
    let currentMessage = {}; // Reset message for each address
    try {
      for (const [index, tx] of block.transactions.entries()) {
        const platform = await processTransaction(
          tx,
          targetAddress,
          index,
          currentMessage,
          connection
        );
        let infoGathered = false;
        if (platform === "Raydium") {
          infoGathered = await getDexInfo(
            currentMessage.tokenAddress,
            currentMessage,
            false
          );
        } else if (platform === "PumpFun") {
          // already handled in handleTx.js
          infoGathered = true;
        }
        if (messageBool && infoGathered) {
          console.log("Transaction details processed successfully");
          await buildAndSendMessage(currentMessage, "solana", platform);
        }
      }
    } catch (error) {
      console.error(
        `Error processing finalized slot ${slot} for address ${targetAddress}:`,
        error
      );
    }
  }
}

module.exports = handleSlot;
