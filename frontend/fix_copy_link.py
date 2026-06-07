import os
import re

file_path = os.path.expanduser("~/hermes-workspace/wager-chess/frontend/app/components/ChessGame.tsx")
with open(file_path, "r") as f:
    content = f.read()

share_btn = """
          <button onClick={() => {if(inputGameId) setGameId(BigInt(inputGameId))}} className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition-all border border-blue-500/20">
            Set Active ID
          </button>
          
          {gameId !== null && (
             <button onClick={() => {
                 const url = window.location.origin + '/play?gameId=' + gameId.toString();
                 navigator.clipboard.writeText(url);
                 alert('Link copied: ' + url);
             }} className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-medium hover:bg-accent/30 transition-all border border-accent/20">
               Copy Share Link
             </button>
          )}
"""

content = content.replace('<button onClick={() => {if(inputGameId) setGameId(BigInt(inputGameId))}} className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition-all border border-blue-500/20">\n            Set Active ID\n          </button>', share_btn)

with open(file_path, "w") as f:
    f.write(content)
