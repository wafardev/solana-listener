const axios = require("axios");

const { TELEGRAM_TOKEN, CHAT_ID, THREAD_ID } = process.env;
if (!TELEGRAM_TOKEN || !CHAT_ID || !THREAD_ID) {
  console.error(
    "Environment variables TELEGRAM_TOKEN, CHAT_ID, or THREAD_ID are missing."
  );
  process.exit(1);
}

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

async function sendMessage(message, retries = 3, retryDelay = 1000) {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: CHAT_ID,
        message_thread_id: THREAD_ID,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
      console.log("Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      const isConnectionError = error.code === "ECONNRESET";
      const isLastAttempt = attempt >= retries - 1;

      console.error(
        `Error sending message (Attempt ${attempt + 1}/${retries}): ${
          error.response
            ? `HTTP ${error.response.status} - ${error.response.data.description}`
            : error.message
        }`
      );

      if (isConnectionError && !isLastAttempt) {
        console.warn(`Retrying in ${retryDelay} ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        attempt++;
      } else {
        if (isLastAttempt) {
          console.error("Max retries reached. Unable to send message.");
        }
        throw error;
      }
    }
  }
  throw new Error(`Failed to send message after ${retries} retries.`);
}

module.exports = { sendMessage };
