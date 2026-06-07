import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { monadTestnet } from 'viem/chains';
import fs from 'fs';

const abiPath = './abi/WagerChessEngine.json';
const WagerChessEngineABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const WAGER_CHESS_ENGINE_ADDRESS = "0xF2c1e9a198A11eAD70bF7C9d054cFc3AD460AEF2";

const account1 = privateKeyToAccount('0x6fc13a20c0df8436b369076e8560c0ebeda32ff512b1ab5b69eddb3507f93b29');
const account2 = privateKeyToAccount('0x0000000000000000000000000000000000000000000000000000000000000002');

const customMonad = {
  ...monadTestnet,
  id: 10143,
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz/"] },
    public: { http: ["https://testnet-rpc.monad.xyz/"] },
  }
};

const publicClient = createPublicClient({ chain: customMonad, transport: http() });
const walletClient1 = createWalletClient({ account: account1, chain: customMonad, transport: http() });
const walletClient2 = createWalletClient({ account: account2, chain: customMonad, transport: http() });

function sq(s: string) {
    const file = s.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(s[1]) - 1;
    return rank * 8 + file;
}

async function run() {
    console.log("Playing Fool's Mate on-chain...");

    const createTx = await walletClient1.writeContract({
        address: WAGER_CHESS_ENGINE_ADDRESS, abi: WagerChessEngineABI,
        functionName: "createGame", args: [account2.address], value: parseEther("0.01")
    });
    await publicClient.waitForTransactionReceipt({ hash: createTx });
    
    const nextGameId = await publicClient.readContract({
        address: WAGER_CHESS_ENGINE_ADDRESS, abi: WagerChessEngineABI, functionName: "nextGameId"
    });
    const gameId = Number(nextGameId) - 1;
    console.log("Game created. ID:", gameId);

    const joinTx = await walletClient2.writeContract({
        address: WAGER_CHESS_ENGINE_ADDRESS, abi: WagerChessEngineABI,
        functionName: "joinGame", args: [gameId], value: parseEther("0.01")
    });
    await publicClient.waitForTransactionReceipt({ hash: joinTx });
    console.log("Player 2 joined. Pot is now 0.02 MON");

    // Fool's Mate sequence:
    // 1. f3 e5
    // 2. g4 Qh4#
    const moves = [
        { from: 'f2', to: 'f3', player: walletClient1, name: "White Pawn f2-f3 ($1 fee)" },
        { from: 'e7', to: 'e5', player: walletClient2, name: "Black Pawn e7-e5 ($1 fee)" },
        { from: 'g2', to: 'g4', player: walletClient1, name: "White Pawn g2-g4 ($1 fee)" },
        { from: 'd8', to: 'h4', player: walletClient2, name: "Black Queen d8-h4 (Checkmate! $9 fee + $5 Check Penalty)" }
    ];

    for (const m of moves) {
        console.log(`Executing ${m.name}...`);
        const tx = await m.player.writeContract({
            address: WAGER_CHESS_ENGINE_ADDRESS, abi: WagerChessEngineABI,
            functionName: "makeMove", args: [gameId, sq(m.from), sq(m.to), 0],
            value: parseEther("0.01") // Send enough to cover max dynamic fee, excess is automatically refunded by contract
        });
        await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log(`  Tx confirmed: ${tx}`);
    }

    const isGameOver = await publicClient.readContract({
        address: WAGER_CHESS_ENGINE_ADDRESS, abi: WagerChessEngineABI,
        functionName: "isGameOver", args: [gameId]
    });
    console.log("Is Game Over according to Contract?", isGameOver);

    const balBefore = await publicClient.getBalance({ address: account2.address });
    console.log("Player 2 balance before claim:", formatEther(balBefore));

    console.log("Player 2 claiming payout...");
    const claimTx = await walletClient2.writeContract({
        address: WAGER_CHESS_ENGINE_ADDRESS, abi: WagerChessEngineABI,
        functionName: "claimPayout", args: [gameId]
    });
    await publicClient.waitForTransactionReceipt({ hash: claimTx });

    const balAfter = await publicClient.getBalance({ address: account2.address });
    console.log("Player 2 balance after claim:", formatEther(balAfter));
    console.log("Net Payout Gained (minus gas/claim):", formatEther(balAfter - balBefore), "MON");
    
    // Let's also check the state of the game
    const gameInfo: any = await publicClient.readContract({
        address: WAGER_CHESS_ENGINE_ADDRESS, abi: WagerChessEngineABI,
        functionName: "games", args: [gameId]
    });
    console.log("Total Fees Collected by Contract:", formatEther(gameInfo[6]), "MON");
}
run().catch(console.error);
