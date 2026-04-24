# CrudeTrace Notifier

Web2 API integration service for CrudeTrace that provides real-time notifications and webhook support.

## Features

- **Telegram Bot**: Sends instant notifications for supply chain events
- **Webhook API**: REST endpoints for external system integration
- **WebSocket Server**: Real-time streaming of blockchain events
- **Event Monitoring**: Listens for all CrudeTrace smart contract events

## Monitored Events

- 🚨 **TheftAlert**: Critical security alerts when volume discrepancies are detected
- 📦 **BatchExtracted**: New batch creation notifications
- ✅ **DeliveryConfirmed**: Successful delivery confirmations
- 💰 **RoyaltiesDistributed**: Payment settlement notifications

## Setup

1. **Install dependencies:**
   ```bash
   cd crudetrace_notifier
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Get Telegram Bot Token:**
   - Message @BotFather on Telegram
   - Create a new bot with `/newbot`
   - Copy the token to `TELEGRAM_BOT_TOKEN`

4. **Get Chat ID:**
   - Start a conversation with your bot
   - Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Copy the `chat.id` to `TELEGRAM_CHAT_ID`

5. **Start the service:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Webhooks
- `POST /webhook/alert` - Receive external alerts
- `GET /health` - Service health check

### WebSocket
- `ws://localhost:8080` - Real-time event streaming

### Telegram Commands
- `/start` - Welcome message
- `/status` - Service status
- `/subscribe` - Subscribe to notifications

## Integration Examples

### Frontend WebSocket Integration
```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'theft_alert') {
    showNotification(`Theft detected in batch ${data.batchId}`);
  }
};
```

### External Webhook Call
```bash
curl -X POST http://localhost:3001/webhook/alert \
  -H "Content-Type: application/json" \
  -d '{
    "type": "custom_alert",
    "batchId": "123",
    "message": "Custom notification"
  }'
```

## Testing the Telegram Bot

Once the notifier service is running, verify your Telegram bot is working:

### 1. **Test Bot Commands**

Open Telegram and message your bot with these commands:

```
/start    - Should see welcome message with feature list
/status   - Should see "Notifier is active and monitoring..."
/subscribe - Should see "You are now subscribed to alerts!"
```

### 2. **Check Service Logs**

Watch the terminal where `npm start` is running. You should see:

```
🚀 Starting CrudeTrace Notifier...
📱 Telegram bot initialized
🎧 Listening to blockchain events...
✅ Event listeners ready
```

If you see `⚠️ Telegram bot not configured (optional)`, your bot token is invalid. Update `.env` with a valid token.

### 3. **Test Webhook Notifications**

Trigger a test alert via webhook:

```bash
curl -X POST http://localhost:3001/webhook/alert \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test_alert",
    "batchId": "999",
    "message": "This is a test notification"
  }'
```

If configured correctly, you should see the alert logged in the service terminal.

### 4. **Real Blockchain Events**

Create or deliver batches in your CrudeTrace Operations page. The notifier will automatically send Telegram notifications when:

- A new batch is extracted (`BatchExtracted` event)
- A batch is delivered (`DeliveryConfirmed` event)
- Theft/loss is detected (`TheftAlert` event)
- Royalties are distributed (`RoyaltiesDistributed` event)

### 5. **Verify Message Delivery**

Check your Telegram chat for notifications like:

```
🚨 THEFT ALERT

Batch: 1
Lost: 10 barrels
Details: Significant volume drop detected in transit.
Tx: 0x1234...
```

### Troubleshooting Telegram Bot

| Issue | Solution |
|-------|----------|
| Bot doesn't respond to `/start` | Check `TELEGRAM_BOT_TOKEN` in `.env` |
| No notifications arriving | Verify `TELEGRAM_CHAT_ID` matches your chat ID |
| "Telegram bot not configured" | Bot token is invalid or missing |
| Service starts but bot fails silently | Check bot token format and validity |

## Deployment to Render

Deploy your notifier service to the cloud using Render:

### 1. **Connect your GitHub repository to Render**

- Go to [render.com](https://render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repo (CrudeTrace)
- Select the repository and branch

### 2. **Configure the service**

Set these values:

- **Name**: `crudetrace-notifier`
- **Environment**: `Node`
- **Build Command**: `cd crudetrace_notifier && npm install`
- **Start Command**: `cd crudetrace_notifier && npm start`
- **Plan**: Free (or paid for production)

### 3. **Set environment variables**

Add these in Render dashboard under "Environment":

```
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
PORT=3001
```

### 4. **Deploy**

Click "Create Web Service" and Render will automatically:
- Clone your repository
- Run build command (`npm install` + `npm run build`)
- Start the service on a public URL

### 5. **Verify deployment**

Test your deployed service:

```bash
curl https://your-service-name.onrender.com/health
```

Response should be:
```json
{
  "status": "healthy",
  "timestamp": "2026-04-24T...",
  "blockchain": "Sepolia",
  "contract": "0x022a41beC91e71CfF71Bb452BC157707F36aabdB"
}
```

### Troubleshooting Render Deployment

| Issue | Solution |
|-------|----------|
| Build fails with "Cannot find module" | Make sure `postinstall` script is in package.json |
| TypeScript not compiling | Verify TypeScript is in dependencies (or devDependencies) |
| Bot not responding | Check environment variables are set correctly |
| Port issues | Render assigns port automatically, ensure PORT env var is set |

## Architecture

```
Blockchain Events → Notifier Service → Telegram + Webhooks + WebSocket
```

The service runs independently from the frontend and provides Web2 API capabilities for enterprise integrations.