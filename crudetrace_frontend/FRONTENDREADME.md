"""# CrudeTrace Frontend Implementation Guide

This guide outlines the architecture, design system, and Web3 interaction flows for the CrudeTrace React + Vite frontend dashboard. It is structured to help you quickly build a high-performance, professional UI that interacts seamlessly with your deployed Sepolia smart contracts.

## 1. Project Architecture & Setup

Since your React + Vite foundation is already initialized, structure your `src` directory to separate Web3 logic from UI components.

```text
src/
├── assets/             # Images, icons
├── components/         # Reusable UI (Buttons, Cards, Modals)
├── config/             # Smart contract addresses and ABIs
├── contexts/           # Web3 state management (WalletContext)
├── hooks/              # Custom hooks (useContract, useWallet)
├── pages/              # Main dashboard views
│   ├── Dashboard.jsx   # Global stats (Total volume, royalties paid)
│   ├── Operations.jsx  # Wellhead & Terminal data entry forms
│   └── Admin.jsx       # Role management & manual triggers
├── utils/              # Formatting helpers (Wei to Eth, date format)
└── App.jsx             # Router setup
```

### Web3 Dependencies
Install the necessary libraries for smart contract interaction and UI styling:
```bash
npm install ethers tailwindcss lucide-react recharts
```

## 2. Smart Contract Configuration

Create a file `src/config/contracts.js` to store your deployed addresses and ABIs.

```javascript
CONTRACT_ADDRESSES = 
  CRUDE_TRACE: "0x022a41beC91e71CfF71Bb452BC157707F36aabdB",
  MOCK_USDC: "0xF41dE9305229830dA261aff0ED4791BC5558d823",

raw abis are in cudetrace_smartcontract folder
```

## 3. Design System & UI Layout

Given the industrial and financial nature of this application, a "Dark Mode" technical aesthetic works best. 

* **Background:** `#0f172a` (Tailwind `slate-900`)
* **Surface Cards:** `#1e293b` (Tailwind `slate-800`)
* **Accents:** * Success/Active: `#10b981` (Emerald green for active sensors)
    * Warning/Alert: `#f59e0b` (Amber for theft/evaporation alerts)
    * Brand/Primary: `#3b82f6` (Blue for Web3 actions)
* **Typography:** Inter or Roboto Mono for numbers (makes financial data look tabular and clean).

### Navigation Sidebar
* **Overview**: High-level metrics (Total Barrels, Total Royalties Distributed).
* **Extraction (Wellhead)**: Input forms for IoT simulation.
* **Delivery (Terminal)**: Input forms for receiving terminals.
* **Treasury**: Read-only view of the 50/30/20 splits and balances.
* **Access Control**: Form to grant/revoke Oracle and Automation roles.

## 4. Interaction Implementation (The Hooks)

To keep your UI clean, abstract the Ethers.js logic into custom React hooks.

### Reading Data (Treasury & Batch Status)
```javascript
// Example Hook: useBatchData.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CRUDE_TRACE_ABI } from '../config/contracts';

export const useBatchData = (batchId, provider) => {
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    const fetchBatch = async () => {
      if (!provider || !batchId) return;
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.CRUDE_TRACE, CRUDE_TRACE_ABI, provider);
      try {
        const data = await contract.batches(batchId);
        setBatch({
          volumeLoaded: ethers.formatUnits(data.volumeLoaded, 0),
          volumeDelivered: ethers.formatUnits(data.volumeDelivered, 0),
          status: data.status // 0: Loaded, 1: Delivered, 2: Settled, etc.
        });
      } catch (err) {
        console.error("Error fetching batch:", err);
      }
    };
    fetchBatch();
  }, [batchId, provider]);

  return batch;
};
```

### Writing Data (Operations Forms)
For your `Operations.jsx` page, you'll need a form that triggers the `logExtraction` transaction. Ensure you handle the 18-decimal formatting for the `MockUSDC` value.

```javascript
// Triggering logExtraction
const handleExtract = async (batchId, volume, valueUSD) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESSES.CRUDE_TRACE, CRUDE_TRACE_ABI, signer);

    // Convert $10,000 to 10000000000000000000000 (18 decimals)
    const valueWei = ethers.parseUnits(valueUSD.toString(), 18);
    
    const tx = await contract.logExtraction(batchId, volume, valueWei);
    await tx.wait(); // Show loading spinner while waiting
    alert("Batch successfully logged at Wellhead!");
  } catch (error) {
    console.error("Extraction failed. Check Oracle Roles.", error);
  }
};
```

## 5. Key Dashboard Views

### A. The Global Dashboard (Read-Only)
Use `Recharts` to build a bar chart showing volume loaded vs. volume delivered over the last 5 batches. Display three prominent Metric Cards at the top:
1.  **Treasury Balance** (Read from MockUSDC contract)
2.  **Total Batches Processed**
3.  **Active Security Alerts** (Listen for `TheftAlert` events)

### B. The Operations Panel (The "Wizard of Oz" UI)
Since you are simulating the IoT sensors manually for demos, build two distinct cards side-by-side:
* **Wellhead Sensor Console**: Fields for `Batch ID`, `Barrels`, and `Batch Value`. Button labeled "Simulate Sensor Payload".
* **Terminal Sensor Console**: Fields for `Batch ID` and `Received Barrels`. Button labeled "Confirm Delivery".

### C. The Webhook / Automation Monitor
Create a section that acts as a log viewer. You can listen to your smart contract events directly in React to update the UI the moment Kwala triggers the royalty distribution.

```javascript
// Listening for the Kwala Automation Trigger
useEffect(() => {
  const contract = new ethers.Contract(CONTRACT_ADDRESSES.CRUDE_TRACE, CRUDE_TRACE_ABI, provider);
  
  contract.on("RoyaltiesDistributed", (batchId, totalAmount) => {
    // Trigger UI notification toast!
    showToast(`Kwala Automated Payout Successful for Batch ${batchId}`);
    // Refresh Treasury balances
  });

  return () => {
    contract.removeAllListeners("RoyaltiesDistributed");
  };
}, []);



Here is the comprehensive breakdown of every single feature and role that needs its own component in your React dashboard to give you full control over the `CrudeTrace` and `MockUSDC` contracts:

### 1. Token Management Panel (MockUSDC)
*The most critical missing piece for the UI. The CrudeTrace contract needs money to pay royalties, so your dashboard needs a way to manage its "bank account."*
* **Treasury Balance Display:** Read `balanceOf` on the MockUSDC contract, passing in the `CrudeTrace` address to show how much runway the contract has left.
* **Fund Treasury Action:** A form for the Admin to send MockUSDC from their connected MetaMask wallet directly to the `CrudeTrace` contract (using the MockUSDC `transfer` function).
* **Wallet Balances:** Read-only cards showing the current MockUSDC balances of the Federal, State, and Community wallets.

### 2. Access Control Panel (Role Management)
*Only the `DEFAULT_ADMIN_ROLE` can see or use this section.*
* **Active Staff Directory:** A list checking `hasRole` to display which addresses currently hold the Wellhead, Terminal, and Automation roles.
* **Onboard/Offboard Form:** An input field for an Ethereum Address, a dropdown menu to select the Role (Wellhead, Terminal, Automation), and buttons to execute `grantRole` or `revokeRole`.

### 3. Emergency & Security Controls
* **Kill Switch:** A prominent toggle switch that calls `pause()` to freeze all contract actions if theft is detected or a sensor is compromised.
* **Resume Operations:** A toggle to call `unpause()` when the threat is resolved.
* **Contract State Indicator:** A global banner at the top of the dashboard reading the `paused()` boolean (Green for Active, Red for Paused).

### 4. Operations Panel (The IoT Simulation)
* **Wellhead Console (Requires `WELLHEAD_ORACLE`):** * Inputs: Batch ID, Volume Loaded, Batch Value in USD.
    * Action: Executes `logExtraction`.
* **Terminal Console (Requires `TERMINAL_ORACLE`):**
    * Inputs: Batch ID, Volume Delivered.
    * Action: Executes `logDelivery`.
* **Manual Settlement Override (Requires `AUTOMATION_ROLE`):**
    * Input: Batch ID.
    * Action: Executes `distributeRoyalties`. *(This is exactly what we used today when Kwala's servers were lagging!)*

---

```

## 6. Error Handling & UX Best Practices

1.  **Graceful Reverts:** Use standard `try/catch` blocks. If the user tries to pump oil without the `WELLHEAD_ORACLE` role, catch the `AccessControlUnauthorizedAccount` custom error and display a clean UI toast: *"Your active wallet lacks Wellhead permissions."*
2.  **Loading States:** Web3 transactions take 10-15 seconds to mine on Sepolia. Always disable buttons and show a loading spinner after the user confirms in MetaMask. 
3.  **Network Enforcement:** On load, verify the user is on Chain ID `11155111` (Sepolia). If not, prompt them to switch networks using `window.ethereum.request({ method: 'wallet_switchEthereumChain' })`.
"""
