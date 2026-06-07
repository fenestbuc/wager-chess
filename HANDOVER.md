# Session Handover & Current State

## Project Overview
**Wager Chess** is a fully-functional, hyper-financialized Web3 chess game built on Monad. It features dynamic move pricing (Queens cost $9, checks incur a $5 penalty) where the winner takes the entire pot. The frontend uses a Liquid Glass design system with Orbitron typography.

## Current State (As of End of Session)
- **Smart Contracts:** Exhaustively tested (Foundry), edge cases (underflow, en passant) resolved, and protocol fee extraction/timeout mechanics added.
- **Frontend:** Fully modularized React components, Framer Motion animations, Wagmi integration, and multiplayer syncing via on-chain event listening.
- **Deployment:** Successfully deployed to the Monad Testnet and hosted on Vercel.
- **Repository:** Hosted on personal GitHub at fenestbuc/wager-chess.

## Important Links & Addresses
- **GitHub Repository:** https://github.com/fenestbuc/wager-chess
- **Live Testnet DApp:** https://frontend-three-phi-7fg8rf5ell.vercel.app/
- **Monad Testnet Contract:** `0x0b0a6a9a49Ab20C18C14a84964a82F520c5aF874`
- **Deployment Wallet Address:** `0xC419268880B11A73E90275CC6852E38ef65a10a3`
  - *(Note: Private key is stored securely in `~/hermes-workspace/wager-chess/contracts/.env`)*

## Next Steps for Tomorrow (Mainnet Launch)
1. **Fund Wallet:** Transfer ~0.6 MON (Mainnet) to the deployment wallet (`0xC419268880B11A73E90275CC6852E38ef65a10a3`).
2. **Deploy Contract:** Run the Foundry script against the Monad Mainnet RPC.
3. **Update Frontend:** 
   - Replace `WAGER_CHESS_ENGINE_ADDRESS` in `app/components/ChessGame.tsx` with the new mainnet address.
   - Update `WagmiProvider.tsx` to use the official Monad Mainnet config instead of `monadTestnet`.
4. **Push to Production:** Run `vercel --prod` to deploy the mainnet-connected UI.

*This document serves as the exact save-state to resume operations.*