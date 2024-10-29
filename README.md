# Solana Transaction Listener

A simple Solana transaction listener that monitors specific wallet addresses for transactions and sends alerts via Telegram.

## Features

- Monitors multiple target wallet addresses for transactions on the Solana blockchain.
- Detects buy and sell transactions, including interaction with specific platforms like Raydium and PumpFun.
- Fetches and formats token metadata, including market cap, volume, name, and symbol.
- Sends transaction alerts via Telegram with detailed information.

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)
- A Solana RPC endpoint (e.g., from a service like QuickNode or Infura)
- Telegram Bot Token (for sending messages)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/wafardev/solana-listener/
   cd solana-listener
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```env
   SOLANA_RPC_URL=your_solana_rpc_url
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```

### Running the Application

To start the Solana listener, run the following command:

```bash
npm run dev
```

For production use, consider using a process manager like PM2:

```bash
pm2 start src/main/main.js --name "solana-listener"
```

### Usage

1. Update the `TARGET_ADDRESSES` array in `src/main/main.js` with the wallet addresses you want to monitor.
2. The application will listen for transactions on the specified addresses and send alerts via your Telegram bot.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### Acknowledgements

- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js) - JavaScript SDK for Solana.
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine.