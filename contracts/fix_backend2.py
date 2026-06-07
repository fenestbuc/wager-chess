import os
import re

file_path = os.path.expanduser("~/hermes-workspace/wager-chess/contracts/src/WagerChessEngine.sol")
with open(file_path, "r") as f:
    content = f.read()

# I likely placed the modifier incorrectly or the replace failed. Let's find it.
print("Does onlyOwner exist?", "onlyOwner" in content)
print(content[:500])

