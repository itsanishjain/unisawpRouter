/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import { HardhatUserConfig } from "hardhat/config";
import "hardhat-gas-reporter";
require("dotenv").config({ path: "./.env" });

const config: HardhatUserConfig = {
  // Your type-safe config goes here
};

export default config;

module.exports = {
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COIN_MARKET_CAP,
  },
  etherscan: {
    apiKey: process.env.EXPLORER_API_KEY,
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_ALCHEMY_API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
