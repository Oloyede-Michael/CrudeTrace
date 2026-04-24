# CrudeTrace Judging Guide

Welcome! This guide explains how to evaluate CrudeTrace and experience the complete Web2-Web3 integration.

## 🎯 Quick Start for Judges (5 minutes)

### Prerequisites
- Node.js 18+ installed
- MetaMask browser extension
- Telegram account
- Terminal/command line access

### Step 1: Clone and Setup

```bash
cd crudetrace_frontend
npm install
npm run dev
```

Open browser to `http://localhost:5173`

### Step 2: Connect Your Wallet

1. Click "Connect Wallet" in the app
2. Approve MetaMask connection
3. Select Sepolia testnet

### Step 3: Grant Yourself Roles (Admin Panel)

1. Navigate to **Admin** page
2. In "Grant Admin Access" section:
   - Enter your wallet address
   - Click "Grant Admin Role"
3. In "Access Control Panel":
   - Select `WELLHEAD_ORACLE`
   - Enter your address
   - Click "Grant Role"
4. Repeat for `TERMINAL_ORACLE`

### Step 4: Create a Test Batch

1. Go to **Operations** page
2. Fill in Wellhead form:
   - Batch ID: `1`
   - Barrels Loaded: `1000`
   - Batch Value (USD): `75000`
3. Click "Simulate Sensor Payload"
4. Approve MetaMask transaction
5. Check **Dashboard** - batch appears!

### Step 5: Experience Web2 Integration

```bash
# In a new terminal, start the notifier service:
cd crudetrace_notifier
npm start
```

Expected output:
```
🚀 Starting CrudeTrace Notifier...
📱 Telegram bot initialized
✅ Notifier is live
🌐 Server running on port 3001
🔗 WebSocket on port 8080
```

### Step 6: Test Telegram Notifications

1. Open Telegram
2. Search for `@crudetrace_alert_bot`
3. Send `/start` to the bot
4. Send `/subscribe` to enable alerts
5. Go back to Operations and create another batch
6. **Watch Telegram** - you'll receive an instant notification! 📱

## 📊 Key Features to Evaluate

### Dashboard (blockchain monitoring)
- ✅ Treasury balance in real-time
- ✅ Total batches discovered from smart contract
- ✅ Live security alerts stream
- ✅ Volume trend chart
- ✅ Searchable batch ledger

### Operations (IoT simulation)
- ✅ Wellhead extraction (requires WELLHEAD_ORACLE)
- ✅ Terminal delivery (requires TERMINAL_ORACLE)
- ✅ Manual settlement (requires AUTOMATION_ROLE)

### Admin (access control)
- ✅ Grant/revoke roles
- ✅ Fund contract treasury
- ✅ Emergency pause switch

### Web2 Integration (NEW)
- ✅ Telegram bot for instant alerts
- ✅ Webhook API for external systems
- ✅ WebSocket for real-time streaming

## 🚨 Test Theft Detection

To see security alerts in action:

1. Create a batch (Wellhead):
   - Batch ID: `1`
   - Loaded: `1000` barrels

2. Deliver with loss (Terminal):
   - Batch ID: `1`
   - Delivered: `900` barrels (100 missing!)

3. **Result**: 
   - Alert appears on Dashboard
   - Telegram notification sent
   - Batch marked with deficit

## 🧪 Test Webhook Integration

In a terminal, trigger a test alert:

```bash
curl -X POST http://localhost:3001/webhook/alert \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test_event",
    "batchId": "999",
    "message": "Test notification from judges"
  }'
```

Check service logs - alert should be logged and displayed.

## 🌐 Architecture

```
Smart Contracts (Sepolia Blockchain)
           ↓
Frontend (React + Ethers.js)
   ├─ Dashboard (read blockchain)
   ├─ Operations (write transactions)
   └─ Admin (manage roles)
           ↓
Web2 Notifier Service
   ├─ Telegram Bot (real-time alerts)
   ├─ Webhook API (enterprise integration)
   └─ WebSocket (live streaming)
```

## 💡 What Makes This Project Special

1. **Hybrid Web2-Web3**: Demonstrates blockchain events trigger Web2 APIs
2. **Real-time Notifications**: Telegram bot for enterprise stakeholders
3. **Enterprise-Ready**: Webhook support for ERP systems
4. **Event-Driven**: Automatic alerts on blockchain changes
5. **Role-Based Access**: Oracle model for IoT data ingestion
6. **Supply Chain Focus**: Solves real industry problem (crude oil tracking)

## 📱 Telegram Bot Commands

Once subscribed to the bot:

```
/start       - Welcome message with features
/status      - Check if service is monitoring blockchain
/subscribe   - Receive real-time alerts
```

Alert types you'll see:
- 🚨 **Theft Alert**: Volume discrepancy detected
- 📦 **Batch Extracted**: New batch logged at wellhead
- ✅ **Delivery Confirmed**: Batch arrived at terminal
- 💰 **Royalties Distributed**: Payments settled

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MetaMask says "wrong network" | Switch to Sepolia testnet in MetaMask |
| Transaction fails with role error | Make sure you granted yourself the role in Admin |
| No Telegram notifications | Check notifier service is running (`npm start`) |
| Bot doesn't respond | Verify bot token in `crudetrace_notifier/.env` |
| Webhook returns 500 | Ensure notifier is running on port 3001 |

## 🎓 Judging Criteria to Focus On

1. **Web3 Integration**: Smart contracts, events, role-based access ✅
2. **Web2 API Engine**: Telegram, webhooks, WebSocket ✅
3. **User Experience**: Dashboard, operations UI, notifications ✅
4. **Real-world Use Case**: Supply chain transparency ✅
5. **Code Quality**: Organized structure, error handling ✅
6. **Documentation**: This guide, READMEs, inline comments ✅

## 📞 Support

If you encounter issues:

1. Check the main [README.md](../README.md) for architecture overview
2. See [crudetrace_frontend/README.md](../crudetrace_frontend/README.md) for frontend setup
3. See [crudetrace_notifier/README.md](../crudetrace_notifier/README.md) for API details
4. Check terminal logs for error messages

---

**Thank you for evaluating CrudeTrace!** We're excited to show you how blockchain can bring transparency to supply chains while maintaining Web2 compatibility for enterprises. 🚀
