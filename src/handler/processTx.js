const handleTx = require("./handleTx");

// Processes individual transactions based on tx logs
async function processTransaction(tx, message, index, targetAddress) {
  if (tx.meta?.err) return false; // Skip errored transactions

  let platform = "";
  let solAmount = 0;
  let tokenAddress = "";
  let tokenAmount = 0;
  let boughtBool = false;

  const txMessage = tx.transaction.message;
  const signature = tx.transaction.signatures[0];
  const logs = tx.meta?.logMessages || [];

  const signer = txMessage.accountKeys
    ? txMessage.accountKeys[0].toBase58()
    : txMessage.staticAccountKeys[0].toBase58();

  if (targetAddress && signer !== targetAddress) return false; // Skip transactions not involving target address

  const pumpLogs = [
    "Program log: Instruction: PumpBuy",
    "Program log: Instruction: PumpSell",
  ];
  const raydiumLogs = [
    "Program log: Instruction: Transfer",
    "Program log: Instruction: CloseAccount",
  ];

  let validTransaction = false;

  // Check for Raydium logs
  if (logs.some((log) => raydiumLogs.includes(log))) {
    platform = "Raydium";
    ({
      solAmount = 0,
      tokenAddress = "",
      tokenAmount = 0,
      boughtBool = false,
    } = handleTx(tx, signer, platform));
    validTransaction = true;
  }
  // Check for PumpFun logs
  else if (logs.some((log) => pumpLogs.includes(log))) {
    // TODO: Implement PumpFun transaction handling
    /*platform = "PumpFun";
    ({
      solAmount = 0,
      tokenAddress = "",
      tokenAmount = 0,
      boughtBool = false,
    } = handleTx(tx, signer, platform));
    validTransaction = true;*/
    return false;
  }

  if (validTransaction) {
    message.signature = signature;
    message.signer = signer;
    message.platform = platform;
    message.solAmount = solAmount;
    message.tokenAddress = tokenAddress;
    message.tokenAmount = tokenAmount;
    message.type = boughtBool ? "Buy" : "Sell";

    console.log(`Transaction ${index + 1 || ""}: ${platform}`);
    console.log(`Signature: ${signature}`);
    console.log(
      `SOL Amount: ${solAmount}, Token Address: ${tokenAddress}, Token Amount: ${tokenAmount}`
    );
    console.log("\n\n");

    return true;
  }

  return false;
}

module.exports = processTransaction;
