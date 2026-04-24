import { ethers } from 'ethers';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import express from 'express';
import cors from 'cors';
import WebSocket from 'ws';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CRUDE_TRACE_ADDRESS = "0x022a41beC91e71CfF71Bb452BC157707F36aabdB";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const SEPOLIA_RPC_FALLBACK = process.env.SEPOLIA_RPC_FALLBACK || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBHOOK_URL = process.env.WEBHOOK_URL || ""; // e.g. https://your-domain.com or ngrok URL
const PORT = process.env.PORT || 3001;

// -------------------- PROVIDER WITH FALLBACK --------------------

function createProvider(): ethers.JsonRpcProvider | ethers.FallbackProvider {
  const primary = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

  if (SEPOLIA_RPC_FALLBACK) {
    const fallback = new ethers.JsonRpcProvider(SEPOLIA_RPC_FALLBACK);
    console.log('🔗 Using primary + fallback RPC providers');
    return new ethers.FallbackProvider([primary, fallback], 1);
  }

  console.log('🔗 Using single RPC provider');
  return primary;
}

const provider = createProvider();

// -------------------- CONTRACT --------------------

const CRUDE_TRACE_ABI = [
  "event TheftAlert(uint256 indexed batchId, uint256 volumeLost, string message)",
  "event BatchExtracted(uint256 indexed batchId, uint256 volume, uint256 value)",
  "event DeliveryConfirmed(uint256 indexed batchId, uint256 volumeDelivered)",
  "event RoyaltiesDistributed(uint256 indexed batchId, uint256 totalAmount)"
];

const crudeTrace = new ethers.Contract(CRUDE_TRACE_ADDRESS, CRUDE_TRACE_ABI, provider);

// -------------------- TELEGRAM BOT --------------------

let bot: TelegramBot | null = null;

if (TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'your_telegram_bot_token_here') {
  try {
    if (WEBHOOK_URL) {
      // Webhook mode — avoids polling Telegram's servers directly (fixes ETIMEDOUT in restricted networks)
      bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
      console.log('📱 Telegram bot initialized (webhook mode)');
    } else {
      // Polling mode — only use if your network can reach api.telegram.org
      bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
      console.log('📱 Telegram bot initialized (polling mode)');
    }
  } catch (error) {
    console.warn('⚠️  Telegram bot initialization failed:', error);
    bot = null;
  }
} else {
  console.log('📱 Telegram bot not configured (optional)');
}

// -------------------- SUBSCRIBERS --------------------

const subscribers = new Set<number>();

// -------------------- EXPRESS --------------------

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- WEBSOCKET --------------------

const wss = new WebSocket.Server({ port: 8080 });
const wsClients: WebSocket[] = [];

wss.on('connection', (ws: WebSocket) => {
  console.log('🔗 WebSocket client connected');
  wsClients.push(ws);

  ws.on('close', () => {
    console.log('🔌 WebSocket disconnected');
    const index = wsClients.indexOf(ws);
    if (index > -1) wsClients.splice(index, 1);
  });

  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to CrudeTrace',
    timestamp: new Date()
  }));
});

function broadcastToWsClients(payload: object) {
  wsClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ ...payload, timestamp: new Date() }));
    }
  });
}

// -------------------- TELEGRAM WEBHOOK ENDPOINT --------------------

if (bot && WEBHOOK_URL) {
  // Register webhook with Telegram
  bot.setWebHook(`${WEBHOOK_URL}/bot${TELEGRAM_BOT_TOKEN}`)
    .then(() => console.log(`✅ Telegram webhook registered: ${WEBHOOK_URL}/bot${TELEGRAM_BOT_TOKEN}`))
    .catch((err: unknown) => console.error('❌ Failed to register Telegram webhook:', err));

  // Receive Telegram updates via POST
  app.post(`/bot${TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot!.processUpdate(req.body);
    res.sendStatus(200);
  });
}

// -------------------- TELEGRAM COMMANDS --------------------

if (bot) {
  bot.onText(/\/start/, (msg: Message) => {
    const chatId = msg.chat.id;
    bot!.sendMessage(chatId,
      `🚀 Welcome to CrudeTrace Notifier!\n\nI send real-time alerts for:\n• Theft detection 🚨\n• Batch extraction 📦\n• Delivery confirmations ✅\n• Royalty distributions 💰\n\nUse /subscribe to start receiving alerts.`
    );
  });

  bot.onText(/\/status/, (msg: Message) => {
    bot!.sendMessage(
      msg.chat.id,
      "✅ CrudeTrace Notifier is active and monitoring the Sepolia blockchain."
    );
  });

  bot.onText(/\/subscribe/, (msg: Message) => {
    const chatId = msg.chat.id;
    subscribers.add(chatId);
    bot!.sendMessage(chatId, "✅ You are now subscribed to alerts!");
  });

  bot.onText(/\/unsubscribe/, (msg: Message) => {
    const chatId = msg.chat.id;
    subscribers.delete(chatId);
    bot!.sendMessage(chatId, "🔕 You have been unsubscribed from alerts.");
  });
}

// -------------------- WEBHOOK ENDPOINT --------------------

app.post('/webhook/alert', (req, res) => {
  const { type, batchId, message, data } = req.body;
  console.log('📨 Webhook received:', { type, batchId, message });
  broadcastToWsClients({ type, batchId, message, data });
  res.json({ success: true });
});

// -------------------- HEALTH --------------------

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    blockchain: 'Sepolia',
    contract: CRUDE_TRACE_ADDRESS,
    telegramMode: WEBHOOK_URL ? 'webhook' : 'polling',
    subscribers: subscribers.size
  });
});

// -------------------- HELPERS --------------------

async function sendToAllSubscribers(message: string) {
  if (!bot) return;

  for (const chatId of subscribers) {
    try {
      await bot.sendMessage(chatId, message);
    } catch (err: unknown) {
      console.error(`❌ Failed to send to ${chatId}`, err);
    }
  }
}

// -------------------- BLOCKCHAIN EVENTS --------------------

async function setupEventListeners() {
  console.log('🎧 Listening to blockchain events...');

  crudeTrace.on("TheftAlert", async (batchId, volumeLost, msgText, event) => {
    const message = `🚨 THEFT ALERT\n\nBatch: ${batchId}\nLost: ${volumeLost} barrels\nDetails: ${msgText}\nTx: ${event.log.transactionHash}`;
    console.log(message);
    broadcastToWsClients({ type: 'TheftAlert', batchId: batchId.toString(), message });
    await sendToAllSubscribers(message);
  });

  crudeTrace.on("BatchExtracted", async (batchId, volume, value) => {
    const message = `📦 New Batch\n\nBatch: ${batchId}\nVolume: ${volume}\nValue: $${ethers.formatUnits(value, 18)}`;
    console.log(message);
    broadcastToWsClients({ type: 'BatchExtracted', batchId: batchId.toString(), message });
    await sendToAllSubscribers(message);
  });

  crudeTrace.on("DeliveryConfirmed", async (batchId, volumeDelivered) => {
    const message = `✅ Delivery Confirmed\n\nBatch: ${batchId}\nDelivered: ${volumeDelivered}`;
    console.log(message);
    broadcastToWsClients({ type: 'DeliveryConfirmed', batchId: batchId.toString(), message });
    await sendToAllSubscribers(message);
  });

  crudeTrace.on("RoyaltiesDistributed", async (batchId, totalAmount) => {
    const message = `💰 Royalties\n\nBatch: ${batchId}\nAmount: $${ethers.formatUnits(totalAmount, 18)}`;
    console.log(message);
    broadcastToWsClients({ type: 'RoyaltiesDistributed', batchId: batchId.toString(), message });
    await sendToAllSubscribers(message);
  });

  console.log('✅ Event listeners ready');
}

// -------------------- START --------------------

async function start() {
  try {
    console.log('🚀 Starting CrudeTrace Notifier...');

    await setupEventListeners();

    app.listen(PORT, () => {
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🔗 WebSocket on port 8080`);
    });

    console.log('✅ Notifier is live');
  } catch (err: unknown) {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  wss.close();
  process.exit(0);
});

start();