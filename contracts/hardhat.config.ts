import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x09e791fea198bcecb63b78651cfc2f5c2c620a36a4694f8c788a3fc3c97b5eef',
        '0xf85ae2c95640ededbb25a729aea45459a60e3ee720e07195f0ee83003d6fbb63',
        '0xb9262c325e54e96e99de59d958d92c865a541acbe5c65a652c00b511d5fc5d0b'
      ]
    },
  },
};
export default config;
