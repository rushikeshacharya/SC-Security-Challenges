// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TokenLender
 * @author Flash
 */
contract TokenLender is ReentrancyGuard {
    using Address for address;
    IERC20 public immutable flashToken;

    constructor(address tokenAddress) {
        flashToken = IERC20(tokenAddress);
    }

    function flashLoan(
        uint256 borrowAmount,
        address borrower,
        address target,
        bytes calldata data
    ) external nonReentrant {
        uint256 balanceBefore = flashToken.balanceOf(address(this));
        require(balanceBefore >= borrowAmount, "Not enough tokens in pool");

        flashToken.transfer(borrower, borrowAmount);
        target.functionCall(data);
        // @audit-info this lets the caller of this function make this contract call anyone and access any function

        uint256 balanceAfter = flashToken.balanceOf(address(this));
        require(
            balanceAfter >= balanceBefore,
            "Flash loan hasn't been paid back"
        );
    }
}
