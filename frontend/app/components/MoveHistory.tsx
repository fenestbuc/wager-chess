"use client";

import { History } from "lucide-react";

interface MoveHistoryProps {
  moves: string[];
  currentMoveIndex?: number;
  onSelectMove?: (index: number) => void;
}

export function MoveHistory({
  moves,
  currentMoveIndex = -1,
  onSelectMove,
}: MoveHistoryProps) {
  const movePairs: Array<{
    number: number;
    white?: string;
    black?: string;
  }> = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
        <History className="w-4 h-4" /> Move History
      </h3>
      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {moves.length === 0 ? (
          <span className="text-sm text-zinc-500 italic">No moves yet</span>
        ) : (
          movePairs.map((pair) => {
            const whiteIdx = (pair.number - 1) * 2;
            const blackIdx = (pair.number - 1) * 2 + 1;

            return (
              <div
                key={pair.number}
                className="grid grid-cols-[2rem_1fr_1fr] gap-2 items-center"
              >
                <span className="text-zinc-500 text-right text-sm font-mono">
                  {pair.number}.
                </span>
                <button
                  type="button"
                  onClick={() => onSelectMove?.(whiteIdx)}
                  className={`text-sm font-mono text-zinc-200 text-left px-2 py-1.5 rounded cursor-pointer transition-colors ${
                    whiteIdx === currentMoveIndex
                      ? "bg-gold-500/10 border border-gold-500/20 text-gold-300"
                      : "hover:bg-surface-raised/50"
                  }`}
                >
                  {pair.white}
                </button>
                {pair.black ? (
                  <button
                    type="button"
                    onClick={() => onSelectMove?.(blackIdx)}
                    className={`text-sm font-mono text-zinc-400 text-left px-2 py-1.5 rounded cursor-pointer transition-colors ${
                      blackIdx === currentMoveIndex
                        ? "bg-gold-500/10 border border-gold-500/20 text-gold-300"
                        : "hover:bg-surface-raised/50"
                    }`}
                  >
                    {pair.black}
                  </button>
                ) : (
                  <span />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
