import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 部署 ERC20 代币合约
  const initialSupply = ethers.utils.parseUnits("1000", 18);  // 初始化 1000 个代币
  const Token = await ethers.getContractFactory("MyToken");
  const paymentToken = await Token.deploy(initialSupply);
  await paymentToken.deployed();
  console.log("Token deployed to:", paymentToken.address);

  // 部署 BuyMyRoom 合约
  const BuyMyRoom = await ethers.getContractFactory("BuyMyRoom");
  const buyMyRoom = await BuyMyRoom.deploy(paymentToken.address);
  await buyMyRoom.deployed();
  console.log("BuyMyRoom deployed to:", buyMyRoom.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });