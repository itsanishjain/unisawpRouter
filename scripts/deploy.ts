import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractFactory("Fetch");
  const deployedcontract = await contract.deploy();
  await deployedcontract.deployed();

  console.log("Deployed Contract Address:", deployedcontract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
