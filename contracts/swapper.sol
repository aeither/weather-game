// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSwap {
    address public tokenA;
    address public tokenB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function swap(uint256 _amount, uint256 direction) public {
        IERC20 erc20A;
        IERC20 erc20B;

        if (direction == 1) {
            erc20A = IERC20(tokenB);
            erc20B = IERC20(tokenA);
        } else {
            erc20A = IERC20(tokenA);
            erc20B = IERC20(tokenB);
        }

        // Approve the transfer of tokens from this contract to msg.sender
        require(erc20A.approve(address(this), _amount), "Approval failed");

        // Transfer tokens from msg.sender to this contract
        require(
            erc20A.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // Transfer tokens from this contract to msg.sender
        require(erc20B.transfer(msg.sender, _amount), "Transfer failed");
    }
}
