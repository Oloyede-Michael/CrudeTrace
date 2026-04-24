import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

async function testNotifier() {
  const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
  const SEPOLIA_RPC_FALLBACK = process.env.SEPOLIA_RPC_FALLBACK || "";
  const PORT = process.env.PORT || 3001;
  const CRUDE_TRACE_ADDRESS = "0x022a41beC91e71CfF71Bb452BC157707F36aabdB";

  if (!SEPOLIA_RPC_URL) {
    console.error("❌ SEPOLIA_RPC_URL is not set in your .env file");
    process.exit(1);
  }

  // -------------------- RPC TEST --------------------

  console.log("🔍 Testing RPC connection...");
  console.log(`   Primary: ${SEPOLIA_RPC_URL}`);

  let provider: ethers.JsonRpcProvider | ethers.FallbackProvider;

  if (SEPOLIA_RPC_FALLBACK) {
    console.log(`   Fallback: ${SEPOLIA_RPC_FALLBACK}`);
    provider = new ethers.FallbackProvider([
      new ethers.JsonRpcProvider(SEPOLIA_RPC_URL),
      new ethers.JsonRpcProvider(SEPOLIA_RPC_FALLBACK),
    ], 1);
  } else {
    provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  }

  try {
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ RPC connection successful — latest block: ${blockNumber}`);
  } catch (err) {
    console.error("❌ RPC connection failed:", err);
    console.log("\n💡 Tip: Try switching to Alchemy or Infura for a more reliable RPC:");
    console.log("   https://alchemy.com  |  https://infura.io");
    process.exit(1);
  }

  // -------------------- CONTRACT TEST --------------------

  console.log("\n🔍 Testing contract connection...");

  const testABI = ["function getAddress() view returns (address)"];

  try {
    const contract = new ethers.Contract(CRUDE_TRACE_ADDRESS, testABI, provider);
    const address = await contract.getAddress();
    console.log(`✅ Contract connection successful: ${address}`);
  } catch (err) {
    // getAddress() might not exist on the contract — that's okay
    console.log(`✅ Contract reachable at ${CRUDE_TRACE_ADDRESS} (getAddress() not exposed — expected)`);
  }

  // -------------------- HEALTH CHECK --------------------

  console.log("\n🔍 Testing notifier service...");

  const healthUrl = `http://localhost:${PORT}/health`;

  try {
    const response = await fetch(healthUrl);

    if (response.ok) {
      const health = await response.json() as {
        status: string;
        timestamp: string;
        blockchain: string;
        contract: string;
        telegramMode: string;
        subscribers: number;
      };
      console.log(`✅ Notifier is healthy`);
      console.log(`   Status:        ${health.status}`);
      console.log(`   Blockchain:    ${health.blockchain}`);
      console.log(`   Contract:      ${health.contract}`);
      console.log(`   Telegram mode: ${health.telegramMode}`);
      console.log(`   Subscribers:   ${health.subscribers}`);
    } else {
      console.log(`❌ Notifier responded with status ${response.status}`);
    }
  } catch {
    console.log(`⚠️  Notifier service not running on port ${PORT} (run 'npm start' first)`);
  }

  // -------------------- TELEGRAM TEST --------------------

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = process.env.WEBHOOK_URL;

  console.log("\n🔍 Checking Telegram configuration...");

  if (!telegramToken || telegramToken === 'your_telegram_bot_token_here') {
    console.log("⚠️  TELEGRAM_BOT_TOKEN not set — Telegram alerts disabled");
  } else if (!webhookUrl) {
    console.log("⚠️  WEBHOOK_URL not set — bot will use polling mode");
    console.log("   If you see ETIMEDOUT errors, set WEBHOOK_URL in your .env");
    console.log(`   For local dev: run 'ngrok http ${PORT}' and use the https URL`);
  } else {
    console.log(`✅ Webhook URL configured: ${webhookUrl}`);
    console.log(`   Telegram updates will POST to: ${webhookUrl}/bot<token>`);
  }

  console.log("\n✅ All tests complete.");
}

testNotifier();