"use client";

import { AlertTriangle, Sword } from "lucide-react";
import { TurnIndicator } from "./TurnIndicator";

interface GameStatusPanelProps {
  gameId: string | bigint;
  potSize: string;
  materialAdvantage?: number;
  currentTurn: "white" | "black";
  isYourTurn: boolean;
  whitePlayer?: string;
  blackPlayer?: string;
  status?: "active" | "check" | "checkmate" | "stalemate";
}

function truncateAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatGameId(id: string | bigint): string {
  const str = id.toString();
  if (str.length <= 8) return str;
  return `${str.slice(0, 4)}...${str.slice(-4)}`;
}

export function GameStatusPanel({
  gameId,
  potSize,
  materialAdvantage,
  currentTurn,
  isYourTurn,
  whitePlayer,
  blackPlayer,
  status = "active",
}: GameStatusPanelProps) {
  return (
    <div className="w-full glass rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-2 py-1 rounded-md bg-surface-raised border border-border text-xs font-mono text-zinc-400">
            Game #{formatGameId(gameId)}
          </span>
          {status !== "active" && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
              <AlertTriangle className="w-3 h-3" />
              {status === "check"
                ? "Check"
                : status === "checkmate"
                ? "Checkmate"
                : "Stalemate"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          {whitePlayer && (
            <span className="flex items-center gap-1.5">
              <Sword className="w-3.5 h-3.5 text-zinc-500" />
              White: {truncateAddress(whitePlayer)}
            </span>
          )}
          {blackPlayer && (
            <span className="flex items-center gap-1.5">
              <Sword className="w-3.5 h-3.5 text-zinc-500" />
              Black: {truncateAddress(blackPlayer)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-1">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">
          Total Pot
        </span>
        <span className="text-2xl font-bold text-gold-400">{potSize}</span>
        {materialAdvantage !== undefined && (
          <span
            className={`text-xs font-mono ${
              materialAdvantage > 0
                ? "text-green-400"
                : materialAdvantage < 0
                ? "text-red-400"
                : "text-zinc-500"
            }`}
          >
            {materialAdvantage > 0 ? "+" : ""}
            {materialAdvantage} material
          </span>
        )}
        <TurnIndicator
          currentTurn={currentTurn}
          isYourTurn={isYourTurn}
          isActive
        />
      </div>
    </div>
  );
}
