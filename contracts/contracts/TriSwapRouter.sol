//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "./access/Ownable.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount)
        external
        returns (uint256);
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount)
        external
        returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner, address indexed spender, uint256 value
    );
}

interface IUniswapV2Router {
    function getAmountsOut(uint256 amountIn, address[] memory path)
        external
        view
        returns (uint256[] memory amounts);
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

interface IUniswapV2Pair {
    function token0() external view returns (address);
    function token1() external view returns (address);

}

contract TriSwapRouter is Ownable {

    uint256 public deadline;

    constructor() Ownable(msg.sender) {
        deadline = 300;
    }

    function swap(address router, address _tokenIn, address _tokenOut, uint256 _amount) private {
        IERC20(_tokenIn).approve(router, _amount);
        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        uint256 _deadline = block.timestamp + deadline;
        IUniswapV2Router(router).swapExactTokensForTokens(_amount, 1, path, address(this), _deadline);
    }

    function getAmountOutMin(address router, address _tokenIn, address _tokenOut, uint256 _amount) public view returns (uint256) {
        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        uint256[] memory amountOutMins = IUniswapV2Router(router).getAmountsOut(_amount, path);
        return amountOutMins[path.length -1];
    }

    function estimateDualDexTrade(address _router1, address _router2, address _token1, address _token2, uint256 _amount) external view returns (uint256) {
        uint256 amtBack1 = getAmountOutMin(_router1, _token1, _token2, _amount);
        uint256 amtBack2 = getAmountOutMin(_router2, _token2, _token1, amtBack1);
        return amtBack2;
    }

    function dualDexTrade(address _router1, address _router2, address _token1, address _token2, uint256 _amount) external onlyOwner {
        uint256 startBalance = IERC20(_token1).balanceOf(address(this));
        uint256 token2InitialBalance = IERC20(_token2).balanceOf(address(this));
        swap(_router1, _token1, _token2, _amount);
        uint256 token2Balance =  IERC20(_token2).balanceOf(address(this));
        uint256 tradeableAmount = token2Balance - token2InitialBalance;
        swap(_router2, _token2, _token1, tradeableAmount);
        uint256 endBalance = IERC20(_token1).balanceOf(address(this));

        require(endBalance > startBalance, "Trade Reverted No Profit Made!!.");
    }

    function estimateDualDexTrade(address _router1, address _router2, address _router3, address _token1, address _token2,address _token3, uint256 _amount) 
      external view returns (uint256) {
        uint256 amtBack1 = getAmountOutMin(_router1, _token1, _token2, _amount);
        uint256 amtBack2 = getAmountOutMin(_router2, _token2, _token3, amtBack1);
        uint256 amtBack3 = getAmountOutMin(_router3, _token3, _token1, amtBack2);
        return amtBack3;
    }

    function getBalance(address _tokenContract) external view returns (uint256) {
        uint256 balance = IERC20(_tokenContract).balanceOf(address(this));
        return balance;
    }

    function recoverToken(address _tokenContract, address _recipient) external onlyOwner {
        IERC20 token = IERC20(_tokenContract);
        token.transfer(_recipient, token.balanceOf(address(this)));
    }

    function recoverETH(address _owner) external onlyOwner {
        (bool success, ) = payable(_owner).call{value: address(this).balance}("");
        require(success, "ETH Transfer failed");
    }

    receive() external payable {}

    fallback() external payable {}

}
