// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title FlashToken
 * @author Flash
 */
contract FlashToken is ERC20 {
    constructor() ERC20("FlashToken", "FLASH") {
        _mint(msg.sender, type(uint256).max);
    }
}