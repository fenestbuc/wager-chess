import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { monadTestnet } from 'viem/chains';

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

async function run() {
    console.log("Player 1 Balance:", formatEther(await publicClient.getBalance({address: account1.address})));
    console.log("Player 2 Balance:", formatEther(await publicClient.getBalance({address: account2.address})));

    console.log("Funding Player 2 with 0.5 MON...");
    const fundTx = await walletClient1.sendTransaction({
        to: account2.address,
        value: parseEther("0.5")
    });
    await publicClient.waitForTransactionReceipt({ hash: fundTx });
    console.log("Player 2 funded!");
    console.log("Player 2 New Balance:", formatEther(await publicClient.getBalance({address: account2.address})));
}

run().catch(console.error);
