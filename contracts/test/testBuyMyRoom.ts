import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BuyMyRoom", function () {
  // 部署合约的 fixture
  async function deployFixture() {
    const [owner, user1, user2, feeRecipient] = await ethers.getSigners();

    // 部署 ERC20 代币合约
    const Token = await ethers.getContractFactory("MyToken");
    const paymentToken = await Token.deploy(ethers.utils.parseUnits("1000", 18));  // 初始化1000个代币
    await paymentToken.deployed();

    // 部署房产购买合约
    const BuyMyRoom = await ethers.getContractFactory("BuyMyRoom");
    const buyMyRoom = await BuyMyRoom.deploy(paymentToken.address);
    await buyMyRoom.deployed();

    // 设置手续费接收地址
    await buyMyRoom.setFeeRecipient(feeRecipient.address);

    return { buyMyRoom, paymentToken, owner, user1, user2, feeRecipient };
  }

  describe("House Minting and Listing", function () {
    it("合约所有者应该可以铸造房屋 NFT 给用户1", async function () {
      const { buyMyRoom, owner, user1 } = await loadFixture(deployFixture);

      // 合约所有者铸造房屋给用户1
      await buyMyRoom.connect(owner).mintHouse(user1.address);

      // 验证用户1的房屋余额
      expect(await buyMyRoom.balanceOf(user1.address)).to.equal(1);
    });

    it("用户1应该可以挂单出售房屋", async function () {
      const { buyMyRoom, owner, user1 } = await loadFixture(deployFixture);

      // 铸造房屋给用户1
      await buyMyRoom.connect(owner).mintHouse(user1.address);

      // 用户1挂单出售房屋
      await buyMyRoom.connect(user1).listHouseForSale(1, ethers.utils.parseEther("1"));

      // 验证挂单信息
      const house = await buyMyRoom.houses(1);
      expect(house.isForSale).to.equal(true);
      expect(house.price).to.equal(ethers.utils.parseEther("1"));
    });

    it("用户1应该可以取消挂单", async function () {
      const { buyMyRoom, owner, user1 } = await loadFixture(deployFixture);

      // 铸造房屋并挂单
      await buyMyRoom.connect(owner).mintHouse(user1.address);
      await buyMyRoom.connect(user1).listHouseForSale(1, ethers.utils.parseEther("1"));

      // 取消挂单
      await buyMyRoom.connect(user1).delistHouse(1);

      // 验证房屋是否已取消出售
      const house = await buyMyRoom.houses(1);
      expect(house.isForSale).to.equal(false);
    });
  });

  describe("House Purchase with Ether", function () {
    it("用户2应该可以使用以太币购买用户1的房屋", async function () {
      const { buyMyRoom, owner, user1, user2 } = await loadFixture(deployFixture);

      // 铸造并挂单房屋给用户1
      await buyMyRoom.connect(owner).mintHouse(user1.address);
      await buyMyRoom.connect(user1).listHouseForSale(1, ethers.utils.parseEther("1"));

      // 用户2购买房屋
      await buyMyRoom.connect(user2).buyHouseWithEther(1, { value: ethers.utils.parseEther("1") });

      // 验证所有权转移
      expect(await buyMyRoom.ownerOf(1)).to.equal(user2.address);
    });
  });

  describe("House Purchase with ERC20 Tokens", function () {
    it("用户2应该可以使用 ERC20 代币购买用户1的房屋", async function () {
      const { buyMyRoom, paymentToken, owner, user1, user2 } = await loadFixture(deployFixture);

      // 铸造房屋并挂单
      await buyMyRoom.connect(owner).mintHouse(user1.address);
      await buyMyRoom.connect(user1).listHouseForSale(1, ethers.utils.parseEther("1"));

      // 给用户2分配一些ERC20代币用于购买
      await paymentToken.transfer(user2.address, ethers.utils.parseUnits("100", 18));

      // 用户2批准合约转移代币
      await paymentToken.connect(user2).approve(buyMyRoom.address, ethers.utils.parseUnits("100", 18));

      // 用户2使用ERC20代币购买房屋
      await buyMyRoom.connect(user2).buyHouseWithTokens(1);

      // 验证所有权转移
      expect(await buyMyRoom.ownerOf(1)).to.equal(user2.address);
    });
  });

  describe("Fee Calculation", function () {
    it("系统应该可以计算并收取手续费", async function () {
      const { buyMyRoom, owner, user1, user2, feeRecipient } = await loadFixture(deployFixture);

      // 铸造房屋并挂单
      await buyMyRoom.connect(owner).mintHouse(user1.address);
      await buyMyRoom.connect(user1).listHouseForSale(1, ethers.utils.parseEther("2"));

      // 获取原始的手续费接收地址的余额
      const initialFeeRecipientBalance = await ethers.provider.getBalance(feeRecipient.address);

      // 用户2用以太币购买房屋
      await buyMyRoom.connect(user2).buyHouseWithEther(1, { value: ethers.utils.parseEther("2") });

      // 获取新的手续费接收地址的余额
      const newFeeRecipientBalance = await ethers.provider.getBalance(feeRecipient.address);

      // 验证手续费是否已被收取
      expect(newFeeRecipientBalance).to.be.gt(initialFeeRecipientBalance);
    });
  });

  describe("Property Information", function () {
    it("应该能够获取房屋的详细信息", async function () {
      const { buyMyRoom, owner, user1 } = await loadFixture(deployFixture);

      // 铸造房屋给用户1
      await buyMyRoom.connect(owner).mintHouse(user1.address);

      // 用户1挂单出售
      await buyMyRoom.connect(user1).listHouseForSale(1, ethers.utils.parseEther("1"));

      // 获取房屋信息
      const house = await buyMyRoom.houses(1);
      expect(house.isForSale).to.equal(true);
      expect(house.price).to.equal(ethers.utils.parseEther("1"));
    });
  });
});



// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { expect } from "chai";
// import { ethers } from "hardhat";
//
// describe("Test", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployFixture() {
//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();
//
//     const BuyMyRoom = await ethers.getContractFactory("BuyMyRoom");
//     const buyMyRoom = await BuyMyRoom.deploy();
//
//     return { buyMyRoom, owner, otherAccount };
//   }
//
//   describe("Deployment", function () {
//     it("Should return hello world", async function () {
//       const { buyMyRoom } = await loadFixture(deployFixture);
//       expect(await buyMyRoom.helloworld()).to.equal("hello world");
//     });
//   });
// });