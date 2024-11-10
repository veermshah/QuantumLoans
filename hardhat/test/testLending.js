const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the CompoundInteractor contract
  const CompoundInteractor = await ethers.getContractFactory("CompoundInteractor");
  const compoundInteractor = await CompoundInteractor.deploy();
  await compoundInteractor.deployed();
  console.log("CompoundInteractor deployed to:", compoundInteractor.address);

  // Supply ETH to Compound
  const supplyTx = await compoundInteractor.supplyETH({
    value: ethers.utils.parseEther("1.0"), // Supplying 1 ETH
  });
  await supplyTx.wait();
  console.log("Supplied 1 ETH to Compound");

  // Enter the market to enable borrowing
  const enterMarketTx = await compoundInteractor.enterMarket();
  await enterMarketTx.wait();
  console.log("Entered the cETH market");

  // Borrow USDC from Compound
  const usdcAmount = ethers.utils.parseUnits("100", 6); // Borrowing 100 USDC
  const borrowTx = await compoundInteractor.borrowUSDC(usdcAmount);
  await borrowTx.wait();
  console.log(`Borrowed ${usdcAmount.toString()} USDC from Compound`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
