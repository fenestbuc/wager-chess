"use client";

interface TurnIndicatorProps {
  currentTurn: "white" | "black";
  isYourTurn: boolean;
  isActive?: boolean;
}

export function TurnIndicator({
  currentTurn,
  isYourTurn,
  isActive = true,
}: TurnIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {!isActive ? (
        <>
          <div className="relative flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-zinc-700" />
          </div>
          <span className="text-sm font-medium text-zinc-600">Waiting...</span>
        </>
      ) : isYourTurn ? (
        <>
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500" />
          </div>
          <span className="text-sm font-medium text-gold-400">Your Turn</span>
        </>
      ) : (
        <>
          <div className="relative flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-zinc-500" />
          </div>
          <span className="text-sm font-medium text-zinc-400">
            Opponent&apos;s Turn
          </span>
        </>
      )}
    </div>
  );
}
