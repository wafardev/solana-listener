const processTransaction = require("./processTx");

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

async function handleSlot(slot, connection, targetAddress) {
  console.log(`Waiting for slot ${slot} to be finalized...`);

  const block = await waitForFinalizedBlock(slot, connection);

  console.log(`Processing finalized slot: ${slot}`);
  try {
    if (!block.transactions) {
      console.log(`No transactions found for finalized slot ${slot}`);
      return;
    }

    for (const [index, tx] of block.transactions.entries()) {
      await processTransaction(tx, index, targetAddress);
    }
  } catch (error) {
    console.error(`Error processing finalized slot ${slot}:`, error);
  }
}

module.exports = handleSlot;
