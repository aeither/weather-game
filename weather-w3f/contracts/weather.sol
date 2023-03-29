// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Weather {
    string public condition;
    uint256 public lastUpdated;
    IERC20 public token;
    mapping(uint256 => address) public players;
    mapping(uint256 => string) public conditions;
    uint256 public playerCounter;

    event ConditionUpdated(uint256 indexed timeStamp, string condition);
    event RewardTransferred(address indexed recipient, uint256 amount);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function updateCondition(string calldata _condition) external {
        condition = _condition;
        lastUpdated = block.timestamp;

        emit ConditionUpdated(block.timestamp, _condition);
    }

    function predict(string calldata _condition) external {
        require(
            keccak256(abi.encodePacked(_condition)) ==
                keccak256(abi.encodePacked("Clouds")) ||
                keccak256(abi.encodePacked(_condition)) ==
                keccak256(abi.encodePacked("Rain")) ||
                keccak256(abi.encodePacked(_condition)) ==
                keccak256(abi.encodePacked("Clear")),
            "Condition must be Clouds, Rain, or Clear"
        );

        conditions[playerCounter] = _condition;
        players[playerCounter] = msg.sender;
        playerCounter += 1;
    }

    function rewardPrediction() external {
        uint256 winnersCounter;

        for (uint256 i = 0; i < playerCounter; i++) {
            if (
                keccak256(abi.encodePacked(conditions[i])) ==
                keccak256(abi.encodePacked(condition))
            ) {
                winnersCounter += 1;
            }
        }

        uint256 totalRewardAmount = 100 * 10**18;
        uint256 tokensPerWinner = totalRewardAmount / winnersCounter;

        for (uint256 i = 0; i < playerCounter; i++) {
            if (
                keccak256(abi.encodePacked(conditions[i])) ==
                keccak256(abi.encodePacked(condition))
            ) {
                token.transfer(players[i], tokensPerWinner);

                emit RewardTransferred(msg.sender, tokensPerWinner);
            }
        }
        playerCounter = 0;
    }
}
