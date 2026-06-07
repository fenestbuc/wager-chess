import os
import re

file_path = os.path.expanduser("~/hermes-workspace/wager-chess/frontend/app/components/ChessGame.tsx")
with open(file_path, "r") as f:
    content = f.read()

# Replace the generic move history rendering with the new MoveHistory component if it exists
if "import { MoveHistory }" not in content and os.path.exists(os.path.expanduser("~/hermes-workspace/wager-chess/frontend/app/components/MoveHistory.tsx")):
    content = 'import { MoveHistory } from "./MoveHistory";\n' + content

if "<div className=\"flex flex-wrap gap-2 max-h-32 overflow-y-auto\">" in content:
    # Our manual move history from earlier:
    #         <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
    #          {moveHistory.length === 0 ? (
    #            <span className="text-sm text-zinc-500">No moves yet</span>
    #          ) : (
    #            moveHistory.map((move, i) => (
    #              <span key={i} className="inline-flex items-center rounded bg-surface-raised px-2 py-0.5 text-xs font-mono text-zinc-300">
    #                {Math.floor(i / 2) + 1}.{i % 2 === 0 ? "" : ".."} {move}
    #              </span>
    #            ))
    #          )}
    #        </div>

    old_hist = """        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {moveHistory.length === 0 ? (
            <span className="text-sm text-zinc-500">No moves yet</span>
          ) : (
            moveHistory.map((move, i) => (
              <span key={i} className="inline-flex items-center rounded bg-surface-raised px-2 py-0.5 text-xs font-mono text-zinc-300">
                {Math.floor(i / 2) + 1}.{i % 2 === 0 ? "" : ".."} {move}
              </span>
            ))
          )}
        </div>"""
    
    new_hist = "<MoveHistory moves={moveHistory} />"
    
    content = content.replace(old_hist, new_hist)

with open(file_path, "w") as f:
    f.write(content)
