require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = "";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.27",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    // hardhat: {
    //   forking: {
    //     url: `https://mainnet.infura.io/v3/`, // Replace with your Alchemy or Infura key
    //   },
    //   accounts: [
    //     {
    //       privateKey: PRIVATE_KEY,
    //       balance: "1000",
    //     },
    //   ],
    // },
    mainnet: {
      url: `https://mainnet.infura.io/v3/2O7jwbbhhA0eiGVFyhvTVoBcmTU`,
      accounts: [
        "82c779fd79a1e14bd0c6bc0d98b02de02fc59df3a077beebb052f24ed16eda82",
      ],
      chainId: 1,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: "EHZJG88MUNBTZXVZBEVD7VSBRKM42PQCR3",
    },
  },
};
//npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/K2Ko1NsshRJXC8IiSIBp-PAjVNw7JQp
// npx hardhat node --fork https://mainnet.infura.io/v3/2O7jwbbhhA0eiGVFyhvTVoBcmTU
