# CrudeTrace Frontend

A React + Vite frontend for the CrudeTrace dashboard and simulator. This application connects to deployed CrudeTrace and MockUSDC smart contracts on Sepolia, and provides a UI for monitoring batch movements, simulating IoT events, and managing access roles.

## Features

- Wallet connect via MetaMask
- Sepolia network enforcement
- Live dashboard with:
  - mock USDC treasury balance
  - batch discovery count
  - security alert stream
  - recent batch volume chart
  - searchable batch ledger
- Operations page for simulating:
  - wellhead extraction (WELLHEAD_ORACLE)
  - terminal delivery (TERMINAL_ORACLE)
  - manual settlement override (AUTOMATION_ROLE)
- Admin page for:
  - granting/revoking roles
  - funding the contract treasury with MockUSDC
  - pausing/unpausing the contract

## Project Structure

- `src/App.tsx` — routes for landing page, dashboard, operations, and admin
- `src/contexts/WalletContext.tsx` — wallet connection, signer/provider setup, Sepolia enforcement
- `src/hooks/useContract.tsx` — smart contract instances for CrudeTrace and MockUSDC
- `src/pages/Dashboard.tsx` — platform metrics and batch analytics
- `src/pages/Operations.tsx` — forms for IoT simulation and manual settlement
- `src/pages/Admin.tsx` — role and treasury management UI
- `src/config/contracts.ts` — deployed contract addresses and ABIs

## Prerequisites

- Node.js 20+ recommended
- npm installed
- MetaMask installed in your browser
- Sepolia testnet selected in MetaMask
- Access to the deployed contract addresses in `src/config/contracts.ts`

## Local Setup

```bash
cd crudetrace_frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## How to Use

### 1. Connect Your Wallet

- Click the wallet connect button in the app
- Approve MetaMask account connection
- If not on Sepolia, MetaMask should prompt you to switch networks

### 2. Dashboard

Use the Dashboard to monitor:

- Treasury balance in MockUSDC
- Total batches discovered on-chain
- Real-time theft/security alerts emitted by the contract
- Batch volume trends for the last 10 batches
- A searchable ledger of batch status and delivery details

### 3. Operations

Simulate IoT sensor activity:

- `Wellhead Sensor Console`: submits `logExtraction` and requires `WELLHEAD_ORACLE`
- `Terminal Sensor Console`: submits `logDelivery` and requires `TERMINAL_ORACLE`
- `Manual Settlement Override`: submits `distributeRoyalties` and requires `AUTOMATION_ROLE`

> If a transaction fails with a role error, your address does not have the required contract role.

### 4. Admin

Use Admin to manage contract access and treasury:

- Grant or revoke roles for specific addresses
- Pause or unpause contract operations
- Send MockUSDC to the CrudeTrace contract treasury

## Configured Contracts

The frontend currently points to these deployed addresses:

- `CrudeTrace`: `0x022a41beC91e71CfF71Bb452BC157707F36aabdB`
- `MockUSDC`: `0xF41dE9305229830dA261aff0ED4791BC5558d823`

If you redeploy contracts, update `src/config/contracts.ts` accordingly.

## Notes

- `WalletContext` enforces Sepolia chain ID `11155111`
- `useContract` returns ethers contract instances using the connected signer or provider
- `Dashboard` reads batch data from `BatchExtracted` events and listens for `TheftAlert`
- `Operations` writes to contract methods and is role-protected by the smart contract

## Scripts

- `npm run dev` — start development server
- `npm run build` — compile TypeScript and build production app
- `npm run preview` — preview built app locally
- `npm run lint` — run ESLint

## Troubleshooting

- If MetaMask says permission denied, reconnect and allow account access
- If the app says "Please switch to the Sepolia testnet", switch networks in MetaMask
- If role calls fail, check the Admin page and make sure the address has the required role
- If you redeploy the contract, update `src/config/contracts.ts`
