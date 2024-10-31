// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/access/Ownable.sol"; // 引入Ownable合约进行访问控制


// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMyRoom is ERC721Enumerable, Ownable {


    // 事件
    event HouseListed(uint256 tokenId, uint256 price, address owner);
    event HouseSold(uint256 tokenId, uint256 price, address newOwner);
    event TokensExchanged(address indexed user, uint256 etherAmount, uint256 tokenAmount);

    struct House {
        uint256 price;
        bool isForSale;
        uint256 listedTimestamp;
    }

    mapping(uint256 => House) public houses;  // 存储房屋信息的映射

    uint256 public listingFeePercent = 1;  // 手续费百分比
    address payable public feeRecipient;  // 手续费接收者

    ERC20 public paymentToken;  // ERC20代币合约地址
    uint256 public tokenExchangeRate = 100;  // 每 1 ETH 可以兑换多少积分代币
    address public tokenOwner;  // 新增字段，记录ERC20代币的拥有者

    constructor(ERC20 _paymentToken) ERC721("HouseNFT", "HSE") Ownable(msg.sender) {
        feeRecipient = payable(msg.sender);  // 平台手续费接收地址
        paymentToken = _paymentToken;  // 初始化 ERC20 代币
        tokenOwner = msg.sender;  // 将部署者地址设置为代币的拥有者
    }

    // 铸造新的房屋NFT
    function mintHouse(address recipient) public onlyOwner returns (uint256) {
        uint256 tokenId = totalSupply() + 1;  // 获取新的房屋ID
        _mint(recipient, tokenId);

        houses[tokenId] = House(0, false, 0);  // 初始化房屋信息
        return tokenId;
    }

    // 挂单出售房屋
    function listHouseForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the house for sale");
        require(price > 0, "Price must be greater than zero");

        houses[tokenId].price = price;
        houses[tokenId].isForSale = true;
        houses[tokenId].listedTimestamp = block.timestamp;

        emit HouseListed(tokenId, price, msg.sender);
    }

    // 取消房屋出售
    function delistHouse(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can delist the house");

        houses[tokenId].isForSale = false;
    }

    // 使用以太币购买房屋
    function buyHouseWithEther(uint256 tokenId) public payable {
        House memory house = houses[tokenId];
        require(house.isForSale, "House is not for sale");
        require(msg.value >= house.price, "Insufficient payment");

        address previousOwner = ownerOf(tokenId);
        require(previousOwner != msg.sender, "You already own this house");

        // 计算平台手续费
        uint256 duration = block.timestamp - house.listedTimestamp;
        uint256 fee = (house.price * listingFeePercent * duration) / 10000;

        // 转移所有权
        _transfer(previousOwner, msg.sender, tokenId);

        // 支付房款给房主
        payable(previousOwner).transfer(house.price - fee);

        // 支付手续费给平台
        feeRecipient.transfer(fee);

        // 更新房产状态
        houses[tokenId].isForSale = false;

        emit HouseSold(tokenId, house.price, msg.sender);
    }

    // 使用积分代币购买房屋
    function buyHouseWithTokens(uint256 tokenId) public {
        House memory house = houses[tokenId];
        require(house.isForSale, "House is not for sale");

        address previousOwner = ownerOf(tokenId);
        require(previousOwner != msg.sender, "You already own this house");

        // 计算房屋价格对应的代币数量
        uint256 housePriceInTokens = house.price * tokenExchangeRate;

        // 防止溢出，确保精确计算代币金额
        require(housePriceInTokens / tokenExchangeRate == house.price, "Overflow in token price calculation");

        // 计算平台手续费，考虑到手续费的范围和溢出问题
        uint256 duration = block.timestamp - house.listedTimestamp;
        uint256 feeInTokens = (housePriceInTokens * listingFeePercent * duration) / 10000;

        // 计算用户需要支付的总费用（房屋价格 + 平台手续费）
        uint256 totalCostInTokens = housePriceInTokens + feeInTokens;

        // 检查用户是否有足够的代币余额
        require(paymentToken.balanceOf(msg.sender) >= totalCostInTokens, "Insufficient token balance");

        // 检查用户是否批准足够的代币额度给合约
        require(paymentToken.allowance(msg.sender, address(this)) >= totalCostInTokens, "Insufficient token allowance");

        // 执行代币转账，先支付房款给房主
        bool transferToOwner = paymentToken.transferFrom(msg.sender, previousOwner, housePriceInTokens);
        require(transferToOwner, "Token transfer to previous owner failed");

        // 支付手续费给平台
        bool transferFee = paymentToken.transferFrom(msg.sender, feeRecipient, feeInTokens);
        require(transferFee, "Token transfer for fee failed");

        // 转移房屋所有权
        _transfer(previousOwner, msg.sender, tokenId);

        // 更新房产状态
        houses[tokenId].isForSale = false;

        emit HouseSold(tokenId, housePriceInTokens, msg.sender);
    }


    // 用户将以太币兑换为积分代币，从tokenOwner地址转出
    function exchangeEtherForTokens() public payable {
        require(msg.value > 0, "Ether required to exchange for tokens");

        // 计算用户能得到的积分代币数量
        uint256 tokenAmount = msg.value * tokenExchangeRate;

        // 从 tokenOwner 转移代币给用户，确保已授权足够的额度
        require(paymentToken.allowance(tokenOwner, address(this)) >= tokenAmount, "Insufficient allowance from token owner");
        require(paymentToken.transferFrom(tokenOwner, msg.sender, tokenAmount), "Token transfer failed");

        // 将收到的 ETH 转发给 tokenOwner
        (bool sent, ) = tokenOwner.call{value: msg.value}("");
        require(sent, "Failed to send Ether to token owner");

        emit TokensExchanged(msg.sender, msg.value, tokenAmount);
    }

    // 设置平台手续费比例
    function setListingFeePercent(uint256 _percent) public onlyOwner {
        listingFeePercent = _percent;
    }

    // 更改手续费接收地址
    function setFeeRecipient(address payable _recipient) public onlyOwner {
        feeRecipient = _recipient;
    }

    // 设置代币兑换率
    function setTokenExchangeRate(uint256 rate) public onlyOwner {
        tokenExchangeRate = rate;
    }

    function getPlatformInfo(address user) public view returns (
        uint256 userEthBalance,
        uint256 userTokenBalance,
        uint256 feePercent,
        uint256 exchangeRate
    ) {
        userEthBalance = user.balance;
        userTokenBalance = paymentToken.balanceOf(user);
        feePercent = listingFeePercent;
        exchangeRate = tokenExchangeRate;
    }
}
