// test/CompoundInteractor.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CompoundETHUSDCInteractor", function () {
  let compoundInteractor;
  let deployer;
  let usdc;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    const CompoundInteractor = await ethers.getContractFactory("CompoundETHUSDCInteractor");
    compoundInteractor = await CompoundInteractor.deploy();
    await compoundInteractor.deployed();

    // USDC token address on mainnet
    const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48";
    usdc = await ethers.getContractAt("IERC20", usdcAddress);
  });

  it("Should supply ETH to Compound", async function () {
    const tx = await compoundInteractor.supplyETH({ value: ethers.utils.parseEther("1.0") });
    await tx.wait();

    // Add assertions to verify the supply operation
    // For example, check the cETH balance of the contract
  });

  it("Should enter the cETH market", async function () {
    const tx = await compoundInteractor.enterMarket();
    await tx.wait();

    // Add assertions to verify entering the market
    // For example, check the account's membership in the cETH market
  });

  it("Should borrow USDC from Compound", async function () {
    const usdcAmount = ethers.utils.parseUnits("100", 6); // 100 USDC
    const tx = await compoundInteractor.borrowUSDC(usdcAmount);
    await tx.wait();

    // Add assertions to verify the borrow operation
    // For example, check the USDC balance of the deployer
  });

  it("Should repay borrowed USDC", async function () {
    const usdcAmount = ethers.utils.parseUnits("100", 6); // 100 USDC

    // Approve the contract to spend USDC on behalf of the deployer
    await usdc.approve(compoundInteractor.address, usdcAmount);

    const tx = await compoundInteractor.repayUSDC(usdcAmount);
    await tx.wait();

    // Add assertions to verify the repay operation
    // For example, check the outstanding borrow balance
  });

  it("Should redeem supplied ETH", async function () {
    const cETHAmount = ethers.utils.parseEther("1.0"); // Amount of cETH to redeem
    const tx = await compoundInteractor.redeemETH(cETHAmount);
    await tx.wait();

    // Add assertions to verify the redeem operation
    // For example, check the ETH balance of the deployer
  });
});
