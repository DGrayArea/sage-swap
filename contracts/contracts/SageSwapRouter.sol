// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@aave/protocol-v2/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
// import "@uniswap/v1-periphery/contracts/interfaces/IUniswapExchange.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SageSwapRouter is FlashLoanReceiverBase {
    address public uniswapV2Router;
    address public uniswapV3Router;

    constructor(
        ILendingPoolAddressesProvider _addressProvider,
        address _uniswapV2Router,
        address _uniswapV3Router
    ) FlashLoanReceiverBase(_addressProvider) {
        uniswapV2Router = _uniswapV2Router;
        uniswapV3Router = _uniswapV3Router;
    }

    // Define the Swap struct with the dexType added
    enum DexType {
        UniswapV1,
        UniswapV2,
        UniswapV3,
        OtherDEX
    }

    struct Swap {
        address dex;          // DEX router address (Uniswap v2, v3, etc.)
        address[] path;       // Token path for the swap
        uint24 fee;           // Fee tier for Uniswap v3 (0 for others)
        uint256 amountIn;     // Amount of input token for the swap
        DexType dexType;      // Type of DEX (Uniswap v1, v2, v3, or other DEX)
    }

    function executeArbitrage(Swap[] memory swaps) external {
        bytes memory data = abi.encode(swaps);
        ILendingPool lendingPool = ILendingPool(ADDRESSES_PROVIDER.getLendingPool());
        
        // Initiate flash loan
        lendingPool.flashLoan(address(this), swaps[0].path[0], swaps[0].amountIn, data);
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        Swap[] memory swaps = abi.decode(params, (Swap[]));
        uint256 amountToTrade = amount;

        for (uint256 i = 0; i < swaps.length; i++) {
            Swap memory currentSwap = swaps[i];

            // Approve token for the DEX if needed
            IERC20(currentSwap.path[0]).approve(currentSwap.dex, currentSwap.amountIn);

            if (currentSwap.dexType == DexType.UniswapV2) {
                // Uniswap v2 or compatible DEX
                IUniswapV2Router02(currentSwap.dex).swapExactTokensForTokens(
                    currentSwap.amountIn,
                    0, // amountOutMin - adjust based on slippage tolerance
                    currentSwap.path,
                    address(this),
                    block.timestamp
                );
            } else if (currentSwap.dexType == DexType.UniswapV3) {
                // Uniswap v3 with exactInput function
                ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
                    path: abi.encodePacked(currentSwap.path[0], currentSwap.fee, currentSwap.path[1]),
                    recipient: address(this),
                    deadline: block.timestamp,
                    amountIn: currentSwap.amountIn,
                    amountOutMinimum: 0 // adjust based on slippage tolerance
                });
                
                ISwapRouter(currentSwap.dex).exactInput(params);
            } else if (currentSwap.dexType == DexType.UniswapV1) {
                // Uniswap v1 find the corret interface and import. change from v2
              IUniswapV2Router02(currentSwap.dex).swapExactTokensForTokens(
                    currentSwap.amountIn,
                    0, // amountOutMin - adjust based on slippage tolerance
                    currentSwap.path,
                    address(this),
                    block.timestamp
                );
            } else if (currentSwap.dexType == DexType.OtherDEX) {
                // Other DEX (e.g., PancakeSwap, SushiSwap)
                IUniswapV2Router02 otherDexRouter = IUniswapV2Router02(currentSwap.dex);
                otherDexRouter.swapExactTokensForTokens(
                    currentSwap.amountIn,
                    0, // amountOutMin - adjust based on slippage tolerance
                    currentSwap.path,
                    address(this),
                    block.timestamp
                );
            }

            // Update amountToTrade with the balance of the output token after each swap
            amountToTrade = IERC20(currentSwap.path[1]).balanceOf(address(this));
        }

        // Repay flash loan with premium
        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(LENDING_POOL), amountOwed);

        return true;
    }
}