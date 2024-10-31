// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // 导入 Ownable 合约

contract MyToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("TestToken", "TTK") Ownable(msg.sender) { // 传入 msg.sender
        _mint(msg.sender, initialSupply);
    }

    // 添加 mint 函数，使用 onlyOwner 修饰符
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
