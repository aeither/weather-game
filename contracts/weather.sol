// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Weather {
    string public condition;
    uint256 public lastUpdated;
    IERC20 public token;

    event ConditionUpdated(uint256 indexed timeStamp, string condition);
    event RewardTransferred(address indexed recipient, uint256 amount);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function updateCondition(string memory _condition) external {
        condition = _condition;
        lastUpdated = block.timestamp;

        emit ConditionUpdated(block.timestamp, _condition);
    }

    function rewardPrediction(string memory _condition) external {
        require(keccak256(bytes(_condition)) == keccak256(bytes(condition)), "Condition does not match");

        uint256 rewardAmount = 100 * 10**18;
        token.transfer(msg.sender, rewardAmount);

        emit RewardTransferred(msg.sender, rewardAmount);
    }
}
