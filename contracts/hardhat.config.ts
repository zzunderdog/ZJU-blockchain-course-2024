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
        '0x268b6ae322cfce2cd5dd5eb26ae4810b6692847724fc8b241ed2a21db6887de1',
        '0x09ec9925ba8fb14224596916820fa46611ed6aad0a56cfdd7621f890dfa724ad',
        '0x93b982aed6810eef873a1862eb85419b5f2928c84ea9a057999592450861dfe7'
      ]
    },
  },
};
export default config;
