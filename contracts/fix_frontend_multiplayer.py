import os
import re

file_path = os.path.expanduser("~/hermes-workspace/wager-chess/frontend/app/components/ChessGame.tsx")
with open(file_path, "r") as f:
    content = f.read()

# Add useSearchParams and useWatchContractEvent
imports = """import { useSearchParams } from "next/navigation";
import { useWatchContractEvent } from "wagmi";"""

if "useSearchParams" not in content:
    content = content.replace('import { useAccount, useWriteContract, useReadContract, usePublicClient } from "wagmi";', imports + '\nimport { useAccount, useWriteContract, useReadContract, usePublicClient } from "wagmi";')

index_to_sq = """// Convert index 0-63 to algebraic
function indexToSquare(idx: number): string {
  const file = String.fromCharCode('a'.charCodeAt(0) + (idx % 8));
  const rank = Math.floor(idx / 8) + 1;
  return file + rank;
}
"""

if "indexToSquare" not in content:
    content = content.replace('export function ChessGame() {', index_to_sq + '\nexport function ChessGame() {')

# Hook implementations
hooks = """  const searchParams = useSearchParams();
  const initialGameId = searchParams?.get("gameId");
  
  useEffect(() => {
    if (initialGameId && !gameId) {
      setGameId(BigInt(initialGameId));
      setInputGameId(initialGameId);
    }
  }, [initialGameId, gameId]);

  useWatchContractEvent({
    address: WAGER_CHESS_ENGINE_ADDRESS,
    abi: WagerChessEngineABI,
    eventName: 'MovePlayed',
    onLogs(logs) {
      for (const log of logs) {
        const { gameId: evGameId, player, from, to, promotion } = log.args as any;
        if (gameId !== null && evGameId === gameId && player !== address) {
            console.log("Opponent moved!", log.args);
            const gameCopy = new Chess(game.fen());
            const sourceSquare = indexToSquare(from);
            const targetSquare = indexToSquare(to);
            let promoStr = undefined;
            if (promotion === 5) promoStr = 'q';
            
            try {
               const moveObj = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: promoStr });
               if (moveObj) {
                  setGame(gameCopy);
                  setMoveHistory(prev => [...prev, moveObj.san]);
               }
            } catch(e) { console.error("Opponent sync error:", e); }
        }
      }
    },
  });
"""

if "useWatchContractEvent" not in content:
    content = content.replace('const publicClient = usePublicClient();', 'const publicClient = usePublicClient();\n\n' + hooks)

with open(file_path, "w") as f:
    f.write(content)
