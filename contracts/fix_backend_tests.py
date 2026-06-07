import os

file_path = os.path.expanduser("~/hermes-workspace/wager-chess/contracts/test/WagerChessEngine.t.sol")
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("( , address w, address b, uint256 wager, uint256 pot, , , bool active, )", "( , address w, address b, uint256 wager, uint256 pot, , , bool active, ,)")
content = content.replace("( , , , , pot, , , , ) = engine.games(gameId);", "( , , , , pot, , , , ,) = engine.games(gameId);")

with open(file_path, "w") as f:
    f.write(content)
