// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ICETH {
    function mint() external payable;
    function redeem(uint256 redeemTokens) external returns (uint256);
    function borrow(uint256 borrowAmount) external returns (uint256);
    function repayBorrow() external payable;
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IComptroller {
    function enterMarkets(address[] calldata cTokens) external returns (uint256[] memory);
}

contract CompoundETHUSDCInteractor {
    address private constant cETHAddress = 0x4Ddc2D193948926D02F9B1fE9e1daa0718270ED5; // cETH contract
    address private constant cUSDCAddress = 0x39AA39c021dfbaE8faC545936693aC917d5E7563; // cUSDC contract
    address private constant usdcAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48; // USDC token
    address private constant comptrollerAddress = 0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B; // Comptroller

    ICETH private cETH = ICETH(cETHAddress);
    IERC20 private usdc = IERC20(usdcAddress);
    IComptroller private comptroller = IComptroller(comptrollerAddress);

    // Supply ETH to Compound
    function supplyETH() external payable {
        require(msg.value > 0, "Must send ETH to supply");
        cETH.mint{value: msg.value}();
    }

    // Enter the market for cETH to enable borrowing
    function enterMarket() external {
        address[] memory markets = new address[](1);
        markets[0] = cETHAddress;
        comptroller.enterMarkets(markets);
    }

    // Borrow USDC from Compound
    function borrowUSDC(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Borrow amount must be greater than zero");
        ICETH cUSDC = ICETH(cUSDCAddress);
        uint256 result = cUSDC.borrow(usdcAmount);
        require(result == 0, "Borrow failed");
        require(usdc.transfer(msg.sender, usdcAmount), "Transfer failed");
    }

    // Repay borrowed USDC
    function repayUSDC(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Repay amount must be greater than zero");
        require(usdc.transferFrom(msg.sender, address(this), usdcAmount), "Transfer failed");
        require(usdc.approve(cUSDCAddress, usdcAmount), "Approval failed");
        ICETH cUSDC = ICETH(cUSDCAddress);
        cUSDC.repayBorrow{value: usdcAmount}();
    }

    // Redeem supplied ETH
    function redeemETH(uint256 cETHAmount) external {
        require(cETHAmount > 0, "Redeem amount must be greater than zero");
        uint256 result = cETH.redeem(cETHAmount);
        require(result == 0, "Redeem failed");
        payable(msg.sender).transfer(address(this).balance);
    }

    // Fallback function to accept ETH
    receive() external payable {}
}
