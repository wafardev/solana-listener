const processTransaction = require("./processTx");

// Function to handle transaction logs and process transaction details
async function handleTransactionLogs(logs, connection, message) {
  try {
    const txDetails = await connection.getTransaction(logs.signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (txDetails) {
      const platform = await processTransaction(
        txDetails,
        undefined,
        undefined,
        message,
        connection
      );
      if (platform === "PumpFun" || platform === "Raydium") {
        console.log(
          "Transaction details processed successfully for:",
          logs.signature
        );
        return platform;
      } else {
        console.log("Transaction processing failed for:", logs.signature);
      }
    } else {
      console.log("Transaction details not found for:", logs.signature);
    }
  } catch (error) {
    console.error("Error fetching or processing transaction details:", error);
  }
  return false;
}

module.exports = handleTransactionLogs;
