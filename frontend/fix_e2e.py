import os
import re

file_path = os.path.expanduser("~/hermes-workspace/wager-chess/frontend/play_full_game.ts")
with open(file_path, "r") as f:
    content = f.read()

# I forgot to update WAGER_CHESS_ENGINE_ADDRESS in the e2e test script! 
# The latest contract address deployed in the "feat: polish UI overhaul" commit was 0x0b0a6a9a49Ab20C18C14a84964a82F520c5aF874.
content = content.replace("0xF2c1e9a198A11eAD70bF7C9d054cFc3AD460AEF2", "0x0b0a6a9a49Ab20C18C14a84964a82F520c5aF874")

with open(file_path, "w") as f:
    f.write(content)
