import os
import re

file_path = os.path.expanduser("~/hermes-workspace/wager-chess/contracts/src/WagerChessEngine.sol")
with open(file_path, "r") as f:
    content = f.read()

# The first replace failed because nextGameId was public but I assumed it was right after the comment
# Let's cleanly inject the owner vars and modifier at the top of the contract.

state_vars = """
    /*//////////////////////////////////////////////////////////////
                                 STATE
    //////////////////////////////////////////////////////////////*/
    address public owner;
    uint256 public claimableFees;
    
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert("Not owner");
        _;
    }
"""

content = content.replace("/*//////////////////////////////////////////////////////////////\n                                 STATE\n    //////////////////////////////////////////////////////////////*/", state_vars)

with open(file_path, "w") as f:
    f.write(content)
