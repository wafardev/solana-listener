const handleTx = require("./handleTx");

// Processes individual transactions based on tx logs
async function processTransaction(
  tx,
  targetAddress,
  index,
  message,
  connection
) {
  if (tx.meta?.err) return false; // Skip errored transactions

  let platform = "";

  const txMessage = tx.transaction.message;
  const signature = tx.transaction.signatures[0];
  const logs = tx.meta?.logMessages || [];

  const signer = txMessage.accountKeys
    ? txMessage.accountKeys[0].toBase58()
    : txMessage.staticAccountKeys[0].toBase58();

  if (targetAddress !== undefined && signer !== targetAddress) return false; // Skip transactions not involving target address

  const pumpLogs = [
    "Program log: Instruction: PumpBuy",
    "Program log: Instruction: PumpSell",
    "Program log: Instruction: Buy",
    "Program log: Instruction: Sell",
  ];
  const raydiumLogs = [
    "Program log: Instruction: Transfer",
    "Program log: Instruction: CloseAccount",
  ];

  let validTransaction = false;

  const isPumpLog = pumpLogs.some((log) => logs.includes(log));

  // Check for PumpFun logs
  if (isPumpLog) {
    platform = "PumpFun";
    validTransaction = await handleTx(
      tx,
      signer,
      platform,
      message,
      connection
    );
  }
  // Check for Raydium logs
  else if (logs.some((log) => raydiumLogs.includes(log))) {
    platform = "Raydium";
    validTransaction = await handleTx(
      tx,
      signer,
      platform,
      message,
      connection
    );
  }

  if (validTransaction) {
    message.signature = signature;
    message.signer = signer;
    message.platform = platform;

    console.log(`Transaction ${index + 1 || ""}: ${platform}`);
    console.log(`Signature: ${signature}`);
    console.log("\n\n");

    console.log(message);

    return message.platform;
  }

  return false;
}

module.exports = processTransaction;
