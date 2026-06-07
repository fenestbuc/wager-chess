# Mainnet Deployment Plan

## 1. Network Configuration
To deploy the final WagerChessEngine to Monad Mainnet, the RPC URL must be updated. Assuming the official RPC endpoint follows their standard nomenclature, it will be added to the `.env` or passed via command line flags.

- **Mainnet RPC URL:** `https://rpc.monad.xyz/` (or standard mainnet endpoint per docs)
- **Chain ID:** `1014` (Assumed Mainnet ID, subject to official docs)

## 2. Wallet Funding
Currently, the deployer wallet (`0xC419268880B11A73E90275CC6852E38ef65a10a3`) only holds **Testnet MON** obtained from the faucet. 
**BLOCKER:** We cannot deploy to Monad Mainnet until real mainnet MON is transferred to this deployment wallet to cover the `~0.6 MON` deployment gas costs.

## 3. Deployment Steps
Once the wallet is funded with real MON, execute the following from the `/contracts` directory:

```bash
forge script script/Deploy.s.sol --rpc-url https://rpc.monad.xyz/ --broadcast --legacy
```

## 4. Frontend Reconfiguration
After the mainnet contract address is logged:
1. Update `WAGER_CHESS_ENGINE_ADDRESS` in `ChessGame.tsx`.
2. Update `WagmiProvider.tsx` to point to the `monad` mainnet chain configuration from `viem/chains` instead of the custom testnet object.
3. Run `npm run build` and `vercel --prod` to push the mainnet-connected UI to production.
