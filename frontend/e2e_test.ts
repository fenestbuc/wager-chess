import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { monadTestnet } from 'viem/chains';
import fs from 'fs';

const abiPath = './abi/WagerChessEngine.json';
const WagerChessEngineABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

const WAGER_CHESS_ENGINE_ADDRESS = "0xF2c1e9a198A11eAD70bF7C9d054cFc3AD460AEF2";

// Two burner wallets for testing
const account1 = privateKeyToAccount('0x6fc13a20c0df8436b369076e8560c0ebeda32ff512b1ab5b69eddb3507f93b29');
// Let's generate a second burner wallet
const account2 = privateKeyToAccount('0x0000000000000000000000000000000000000000000000000000000000000002');

const customMonad = {
  ...monadTestnet,
  id: 10143,
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz/"] },
    public: { http: ["https://testnet-rpc.monad.xyz/"] },
  }
};

const publicClient = createPublicClient({
  chain: customMonad,
  transport: http()
});

const walletClient1 = createWalletClient({
  account: account1,
  chain: customMonad,
  transport: http()
});

const walletClient2 = createWalletClient({
  account: account2,
  chain: customMonad,
  transport: http()
});

async function run() {
  console.log("Player 1:", account1.address);
  console.log("Player 2:", account2.address);

  // Fund player 2 using player 1
  console.log("Funding Player 2...");
  const fundTx = await walletClient1.sendTransaction({
    to: account2.address,
    value: parseEther("0.1")
  });
  await publicClient.waitForTransactionReceipt({ hash: fundTx });
  console.log("Player 2 funded!");

  console.log("Creating game...");
  const createTx = await walletClient1.writeContract({
    address: WAGER_CHESS_ENGINE_ADDRESS,
    abi: WagerChessEngineABI,
    functionName: "createGame",
    args: [account2.address],
    value: parseEther("0.01")
  });
  await publicClient.waitForTransactionReceipt({ hash: createTx });
  
  const nextGameId = await publicClient.readContract({
    address: WAGER_CHESS_ENGINE_ADDRESS,
    abi: WagerChessEngineABI,
    functionName: "nextGameId",
  });
  const gameId = Number(nextGameId) - 1;
  console.log("Game created! ID:", gameId);

  console.log("Player 2 joining game...");
  const joinTx = await walletClient2.writeContract({
    address: WAGER_CHESS_ENGINE_ADDRESS,
    abi: WagerChessEngineABI,
    functionName: "joinGame",
    args: [gameId],
    value: parseEther("0.01")
  });
  await publicClient.waitForTransactionReceipt({ hash: joinTx });
  console.log("Player 2 joined!");

  console.log("Player 1 playing e2-e4 (Pawn)...");
  // e2 is index 12, e4 is index 28
  const move1Tx = await walletClient1.writeContract({
    address: WAGER_CHESS_ENGINE_ADDRESS,
    abi: WagerChessEngineABI,
    functionName: "makeMove",
    args: [gameId, 12, 28, 0],
    value: parseEther("0.0001") // Pawn fee
  });
  await publicClient.waitForTransactionReceipt({ hash: move1Tx });
  console.log("Move 1 successful!");
  
  console.log("E2E Test completed successfully.");
}

run().catch(console.error);
