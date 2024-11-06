const { ethers } = require("hardhat");
const { parseUnits, formatUnits } = ethers.utils;

async function main() {
  // Get contract addresses
  const uniswapV2RouterAddress = "0x5C69bEe701ef814a2B6a3EDD4B1F721e5a22B5b3"; // Example address (Uniswap V2 Router)
  const uniswapV3RouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Example address (Uniswap V3 Router)
  const pancakeSwapRouterAddress = "0x05fF4f79F8FF97e9b0b6A5b585d861ca9E0E0A8D"; // PancakeSwap example

  // Token addresses (example)
  const tokenA = "0x..."; // Example ERC20 token address (e.g., DAI)
  const tokenB = "0x..."; // Example ERC20 token address (e.g., USDC)
  const tokenC = "0x..."; // Example ERC20 token address (e.g., WETH)

  // List of exchanges (DEXes) and their respective quote functions
  const exchanges = [
    {
      name: "Uniswap V2",
      address: uniswapV2RouterAddress,
      quoteFunction: "getAmountsOut",
      routerType: "v2",
    },
    {
      name: "PancakeSwap",
      address: pancakeSwapRouterAddress,
      quoteFunction: "getAmountsOut",
      routerType: "v2",
    },
    {
      name: "Uniswap V3",
      address: uniswapV3RouterAddress,
      quoteFunction: "getAmountsOut",
      routerType: "v3",
    },
  ];

  // Amount to trade
  const amountIn = parseUnits("10", 18); // Example amount (10 tokens)

  // Get your wallet and contracts
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Load MultiSwapArbitrage contract
  const MultiSwapArbitrage = await ethers.getContractFactory(
    "MultiSwapArbitrage"
  );
  const multiSwapArbitrage = await MultiSwapArbitrage.attach(
    "YOUR_CONTRACT_ADDRESS"
  );

  // Get token outputs for all combinations of tokens and exchanges
  const tokenAddresses = [tokenA, tokenB, tokenC];
  let bestQuote = ethers.BigNumber.from(0);
  let bestPath = [];
  let bestDEX = "";

  for (let i = 0; i < tokenAddresses.length; i++) {
    const tokenIn = tokenAddresses[i];

    for (let j = 0; j < exchanges.length; j++) {
      const exchange = exchanges[j];
      const router = await ethers.getContractAt(
        "IUniswapV2Router02",
        exchange.address
      );

      // Get expected output for the token pair (tokenIn -> tokenOut)
      let output;

      if (exchange.routerType === "v2") {
        output = await router[exchange.quoteFunction](amountIn, [
          tokenIn,
          tokenB,
        ]);
      } else if (exchange.routerType === "v3") {
        output = await router[exchange.quoteFunction](amountIn, [
          tokenIn,
          tokenB,
        ]); // Adjust for Uniswap V3 path and fee tier
      }

      console.log(
        `${
          exchange.name
        } expected output for ${tokenIn} to ${tokenB}: ${formatUnits(
          output[1],
          18
        )} ${tokenB}`
      );

      // Compare to find the best quote
      if (output[1].gt(bestQuote)) {
        bestQuote = output[1];
        bestPath = [tokenIn, tokenB];
        bestDEX = exchange.name;
      }
    }
  }

  // If there's an arbitrage opportunity (e.g., profit > threshold), execute the swap
  const profitThreshold = parseUnits("0.1", 18); // Example profit threshold (0.1 tokenB)
  if (bestQuote.gt(amountIn.add(profitThreshold))) {
    console.log("Arbitrage opportunity found, executing swap...");

    // Prepare the swap data
    const swapData = [
      {
        dex:
          bestDEX === "Uniswap V2"
            ? uniswapV2RouterAddress
            : bestDEX === "PancakeSwap"
            ? pancakeSwapRouterAddress
            : uniswapV3RouterAddress,
        path: bestPath,
        fee: bestDEX === "Uniswap V3" ? 3000 : 0, // Set fee for Uniswap V3
        amountIn: amountIn.toString(),
        dexType:
          bestDEX === "Uniswap V3" ? 2 : bestDEX === "PancakeSwap" ? 3 : 1,
      },
    ];

    // Encode data for the contract call
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        "tuple(address dex, address[] path, uint24 fee, uint256 amountIn, uint8 dexType)[]",
      ],
      [swapData]
    );

    // Execute the arbitrage using the contract
    const tx = await multiSwapArbitrage.executeArbitrage(swapData, {
      gasLimit: 5000000,
    });
    console.log("Arbitrage executed, transaction hash:", tx.hash);

    // Wait for transaction to be mined
    await tx.wait();
    console.log("Arbitrage transaction confirmed");
  } else {
    console.log("No arbitrage opportunity found");
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
