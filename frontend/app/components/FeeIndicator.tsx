"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Coins, AlertTriangle } from "lucide-react";

interface FeeIndicatorProps {
  pieceType: "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
  pieceSymbol: string;
  baseFee: string;
  isCheck?: boolean;
  checkPenalty?: string;
  totalFee: string;
  isVisible?: boolean;
  position?: { x: number; y: number };
}

export function FeeIndicator({
  pieceType,
  pieceSymbol,
  baseFee,
  isCheck = false,
  checkPenalty = "0.0005 MON",
  totalFee,
  isVisible = false,
  position = { x: 0, y: 0 },
}: FeeIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 pointer-events-none glass px-4 py-3 rounded-xl border border-gold-500/20 shadow-gold animate-fade-in"
          style={{ left: position.x, top: position.y }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="text-lg">{pieceSymbol}</span>
              <span className="capitalize">{pieceType}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Coins className="w-3.5 h-3.5" />
              <span>Base: {baseFee}</span>
            </div>
            {isCheck && (
              <div className="flex items-center gap-1 text-xs text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Check penalty: {checkPenalty}</span>
              </div>
            )}
            <div className="pt-1 border-t border-white/10 flex items-center justify-between gap-4">
              <span className="text-xs text-zinc-500">Total</span>
              <span className="text-sm font-bold text-gold-400">
                {totalFee}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
