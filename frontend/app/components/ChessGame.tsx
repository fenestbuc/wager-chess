"use client";

import { useState, useCallback, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useSearchParams } from "next/navigation";
import { useWatchContractEvent } from "wagmi";
import { useAccount, useWriteContract, useReadContract, usePublicClient } from "wagmi";
import { parseEther } from "viem";
import WagerChessEngineABI from "../../abi/WagerChessEngine.json";
import { motion, AnimatePresence } from "framer-motion";
import { Info, History, Shield, PlayCircle, LogIn, CheckCircle2 } from "lucide-react";

export const WAGER_CHESS_ENGINE_ADDRESS = "0x0b0a6a9a49Ab20C18C14a84964a82F520c5aF874";

// Convert algebraic e2 to index 0-63
function squareToIndex(sq: string): number {
  const file = sq.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(sq[1]) - 1;
  return rank * 8 + file;
}

// Convert index 0-63 to algebraic
function indexToSquare(idx: number): string {
  const file = String.fromCharCode('a'.charCodeAt(0) + (idx % 8));
  const rank = Math.floor(idx / 8) + 1;
  return file + rank;
}

export function ChessGame() {
  const { address, isConnected } = useAccount();
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<{san: string, color: string}[]>([]);
  const [gameId, setGameId] = useState<bigint | null>(null);
  const [inputGameId, setInputGameId] = useState("");
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const { data: contractGameState } = useReadContract({
    address: WAGER_CHESS_ENGINE_ADDRESS,
    abi: WagerChessEngineABI,
    functionName: "games",
    args: gameId !== null ? [gameId] : undefined,
    query: {
      enabled: gameId !== null,
      refetchInterval: 2000,
    }
  });

  const getPieceFee = (pieceType: string) => {
    switch(pieceType.toLowerCase()) {
      case 'q': return "0.0009 MON ($9)";
      case 'r': return "0.0005 MON ($5)";
      case 'b': 
      case 'n': return "0.0003 MON ($3)";
      default: return "0.0001 MON ($1)";
    }
  };

  const makeMove = useCallback(
    async (sourceSquare: string, targetSquare: string) => {
      if (!gameId && gameId !== BigInt(0)) {
        alert("Please set an Active Game ID first!");
        return false;
      }

      const gameCopy = new Chess(game.fen());
      try {
        const move = gameCopy.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });

        if (move === null) return false;

        const fromIdx = squareToIndex(sourceSquare);
        const toIdx = squareToIndex(targetSquare);
        const promotion = move.promotion ? 5 : 0; // 5=Queen

        
        console.log("Fetching dynamic fee...");
        const fee = await publicClient?.readContract({
          address: WAGER_CHESS_ENGINE_ADDRESS,
          abi: WagerChessEngineABI,
          functionName: "getMoveFee",
          args: [gameId, fromIdx],
        }) as bigint;

        // If it's going to be a check, we need to manually add 0.0005 to the fee requirement on the frontend 
        // to pass the msg.value check, because getMoveFee only calculates the piece base cost, not the post-move check penalty.
        let finalValue = fee;
        const testCheck = new Chess(game.fen());
        testCheck.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
        if (testCheck.isCheck()) {
            finalValue = finalValue + parseEther("0.0005");
        }

        console.log("Submitting TX with value:", finalValue.toString());
        const tx = await writeContractAsync({
          address: WAGER_CHESS_ENGINE_ADDRESS,
          abi: WagerChessEngineABI,
          functionName: "makeMove",
          args: [gameId, fromIdx, toIdx, promotion],
          value: finalValue, 
        });


        console.log("Move TX submitted:", tx);
        
        setGame(gameCopy);
        setMoveHistory((prev) => [...prev, {san: move.san, color: move.color}]);
        return true;
      } catch (err) {
        console.error("Move failed:", err);
        return false;
      }
    },
    [game, gameId, writeContractAsync, publicClient]
  );

  const handleCreateGame = async () => {
    if (!isConnected) return alert("Connect wallet first");
    const opponent = prompt("Enter opponent address (or leave blank to play against a burner):", "0x0000000000000000000000000000000000000001");
    if (!opponent) return;

    try {
      const tx = await writeContractAsync({
        address: WAGER_CHESS_ENGINE_ADDRESS,
        abi: WagerChessEngineABI,
        functionName: "createGame",
        args: [opponent],
        value: parseEther("0.01"), 
      });
      console.log("Create Game TX:", tx);
      alert("Game created! TX: " + tx);
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinGame = async () => {
    if (!isConnected) return alert("Connect wallet first");
    if (!inputGameId) return alert("Enter a game ID");
    
    try {
      const tx = await writeContractAsync({
        address: WAGER_CHESS_ENGINE_ADDRESS,
        abi: WagerChessEngineABI,
        functionName: "joinGame",
        args: [BigInt(inputGameId)],
        value: parseEther("0.01"),
      });
      console.log("Join Game TX:", tx);
      setGameId(BigInt(inputGameId));
      alert("Joined game " + inputGameId);
    } catch (e) {
      console.error(e);
    }
  };

  const currentTurnColor = game.turn() === 'w' ? 'White' : 'Black';
  
  const hoveredPieceFee = useMemo(() => {
    if (!hoveredSquare) return null;
    const piece = game.get(hoveredSquare as any);
    if (!piece || piece.color !== game.turn()) return null;
    return getPieceFee(piece.type);
  }, [hoveredSquare, game]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Sidebar - Controls & Status */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Match Control</h2>
          </div>
          
          <div className="flex flex-col gap-4 relative z-10">
            <button 
              onClick={handleCreateGame} 
              className="group flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-accent to-accent-hover text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(245,166,35,0.2)] hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] hover:scale-[1.02]"
            >
              <PlayCircle className="w-4 h-4" />
              Create Game <span className="text-white/70 text-xs font-normal">(0.01 MON)</span>
            </button>
            
            <div className="flex flex-col gap-2 p-3 bg-surface/50 rounded-xl border border-white/5">
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Game ID" 
                  value={inputGameId} 
                  onChange={(e) => setInputGameId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
                <button 
                  onClick={() => {if(inputGameId) setGameId(BigInt(inputGameId))}} 
                  className="px-3 py-2 bg-surface-raised text-white rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-sm"
                  title="Set Active ID without joining"
                >
                  Set ID
                </button>
              </div>
              <button 
                onClick={handleJoinGame} 
                className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors text-sm"
              >
                <LogIn className="w-4 h-4" />
                Join Game <span className="text-zinc-400 text-xs">(0.01 MON)</span>
              </button>
            </div>

            <AnimatePresence>
              {gameId !== null && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Active Game: #{gameId.toString()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Fee Indicator */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg">
          <div className="flex flex-col gap-1 mb-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" /> Current Turn
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <div className={`w-3 h-3 rounded-full ${game.turn() === 'w' ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-zinc-600 shadow-[0_0_10px_rgba(82,82,91,0.8)]'}`}></div>
              <span className="text-xl font-bold">{currentTurnColor} to move</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Hovered Piece Fee</h3>
            <div className="h-12 flex items-center">
              <AnimatePresence mode="wait">
                {hoveredPieceFee ? (
                  <motion.div
                    key="fee"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-2xl font-mono font-bold text-accent drop-shadow-[0_0_10px_rgba(245,166,35,0.3)]"
                  >
                    {hoveredPieceFee}
                  </motion.div>
                ) : (
                  <motion.div
                    key="nofee"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-zinc-500 italic text-sm"
                  >
                    Hover over your piece to see cost
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Chess Board */}
      <div className="lg:col-span-8 flex flex-col gap-4 items-center">
        <div className="w-full max-w-[600px] rounded-xl overflow-hidden border-4 border-surface-raised shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group">
          <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none z-10"></div>
          <Chessboard
            // @ts-ignore
            position={game.fen()}
            onPieceDrop={(sourceSquare: string, targetSquare: string) => {
              makeMove(sourceSquare, targetSquare);
              setHoveredSquare(null);
              return true;
            }}
            onMouseOverSquare={(square: string) => setHoveredSquare(square)}
            onMouseOutSquare={() => setHoveredSquare(null)}
            customBoardStyle={{ borderRadius: "0px" }}
            customDarkSquareStyle={{ backgroundColor: "#171717", color: "#404040" }}
            customLightSquareStyle={{ backgroundColor: "#262626", color: "#737373" }}
            animationDuration={300}
          />
        </div>

        {/* Move History */}
        <div className="w-full max-w-[600px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
            <History className="w-4 h-4" /> Move History
          </h3>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {moveHistory.length === 0 ? (
              <span className="text-sm text-zinc-500 italic">Game has not started</span>
            ) : (
              moveHistory.map((move, i) => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={i} 
                  className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-mono border ${move.color === 'w' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/40 border-black/50 text-zinc-300'}`}
                >
                  {Math.floor(i / 2) + 1}.{i % 2 === 0 ? "" : ".."} {move.san}
                </motion.span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
