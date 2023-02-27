import { BigNumber, Signer } from "ethers";
import { ParrotRewards, Parrot } from "../typechain-types/index";
import ParrotArtifact from "../artifacts/contracts/Parrot.sol/Parrot.json";
import ParrotRewardsArtifact from "../artifacts/contracts/ParrotRewards.sol/ParrotRewards.json";
import { MockUSDC } from "../typechain-types/index";
import MockUSDCArtifact from "../artifacts/contracts/MockUSDC.sol/MockUSDC.json";
import { ethers, waffle } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { deployContract } = waffle;
const { expect } = chai;
chai.use(chaiAsPromised);
let user: SignerWithAddress;
let random: SignerWithAddress;
let contractOwner: SignerWithAddress;
let Parrot: Parrot;
let ParrotRewards: ParrotRewards;
let MockUSDC: MockUSDC;
const oneUSDC = 10 ** 6;
const oneParrot = 10 ** 18;

describe("Initialization of core functions", function () {
  beforeEach(async function () {
    [contractOwner, user, random] = await ethers.getSigners();

    MockUSDC = (await deployContract(
      contractOwner,
      MockUSDCArtifact
    )) as MockUSDC;

    Parrot = (await deployContract(contractOwner, ParrotArtifact, [
      MockUSDC.address,
    ])) as Parrot;

    ParrotRewards = (await deployContract(
      contractOwner,
      ParrotRewardsArtifact,
      [Parrot.address]
    )) as ParrotRewards;
  });
  describe("USDC Contract", function () {
    describe("General Stuff", function () {
      it("should have proper name", async function () {
        expect(await MockUSDC.name()).to.equal("USD Coin");
      });
      it("should have proper symbol", async function () {
        expect(await MockUSDC.symbol()).to.equal("USDC");
      });
      it("should mint some USDC", async function () {
        await expect(
          MockUSDC.connect(contractOwner).mint(contractOwner.address, oneUSDC)
        ).to.be.fulfilled;
        expect(await MockUSDC.balanceOf(contractOwner.address)).to.equal(
          oneUSDC
        );
      });
    });
  });

  describe("Parrot Rewards Contract", function () {
    beforeEach(async function () {
      await expect(
        MockUSDC.connect(contractOwner).mint(
          contractOwner.address,
          oneUSDC * 100
        )
      ).to.be.fulfilled;
      await expect(
        MockUSDC.connect(contractOwner).approve(
          ParrotRewards.address,
          oneUSDC * 1000
        )
      ).to.be.fulfilled;
      await expect(
        Parrot.connect(contractOwner).approve(
          ParrotRewards.address,
          "10000000000000000000000000"
        )
      ).to.be.fulfilled;
      await expect(
        Parrot.connect(contractOwner).transfer(
          user.address,
          "10000000000000000000000"
        )
      ).to.be.fulfilled;
      await expect(
        Parrot.connect(user).approve(
          ParrotRewards.address,
          "10000000000000000000000000"
        )
      ).to.be.fulfilled;
      await expect(
        Parrot.connect(contractOwner).transfer(
          random.address,
          "10000000000000000000000"
        )
      ).to.be.fulfilled;
      await expect(
        Parrot.connect(random).approve(
          ParrotRewards.address,
          "10000000000000000000000000"
        )
      ).to.be.fulfilled;
      await expect(
        ParrotRewards.connect(contractOwner).setUSDCAddress(MockUSDC.address)
      ).to.be.fulfilled;
    });
    describe("General Stuff", function () {
      it("should have proper owner", async function () {
        expect(await ParrotRewards.owner()).to.equal(contractOwner.address);
      });
    });
    describe("Deposit", function () {
      it("should allow a user to deposit the correct amount of shares", async function () {
        const depositAmount = oneUSDC;
        await expect(
          ParrotRewards.connect(contractOwner).deposit(depositAmount)
        ).to.be.fulfilled;
        expect(await ParrotRewards.getShares(contractOwner.address)).to.equal(
          depositAmount
        );
        expect(await ParrotRewards.totalSharesDeposited()).to.equal(
          depositAmount
        );
      });
      it("should decrease the user's balance by the amount deposited", async function () {
        const depositAmount = oneUSDC;
        const userInitialBalance = await Parrot.balanceOf(
          contractOwner.address
        );
        await expect(
          ParrotRewards.connect(contractOwner).deposit(depositAmount)
        ).to.be.fulfilled;
        expect(await Parrot.balanceOf(contractOwner.address)).to.equal(
          userInitialBalance.sub(depositAmount)
        );
      });
      it("should deposit rewards", async function () {
        const depositAmount = (oneParrot * 50).toString();
        await 
          ParrotRewards.connect(contractOwner).deposit(depositAmount)
        
        await ParrotRewards.connect(contractOwner).depositRewards(oneUSDC * 50);
      });
      it("should claim rewards", async function () {
        const depositAmount = (oneParrot * 50).toString();
        await expect(
          ParrotRewards.connect(contractOwner).deposit("7500000000000000000000000")
        ).to.be.fulfilled;
        await expect(
          ParrotRewards.connect(contractOwner).depositRewards(
            oneUSDC * 50
          )
        ).to.be.fulfilled;
        console.log(        await ParrotRewards.connect(contractOwner).getUnpaid(contractOwner.address)        );
        
        await ParrotRewards.connect(contractOwner).claimReward();
      });
      it("should withdraw", async function () {
        const depositAmount = (oneParrot * 50).toString();
        await expect(
          ParrotRewards.connect(contractOwner).deposit("7500000000000000000000000")
        ).to.be.fulfilled;
        await
          ParrotRewards.connect(user).deposit("10000000000000000000000")
          await
          ParrotRewards.connect(random).deposit("10000000000000000000000")
        
        await expect(
          ParrotRewards.connect(contractOwner).depositRewards(
            oneUSDC * 50
          )
        ).to.be.fulfilled;

        await ParrotRewards.connect(random).withdraw("10000000000000000000000");
        await ParrotRewards.connect(user).withdraw("10000000000000000000000");
        await ParrotRewards.connect(contractOwner).withdraw("7500000000000000000000000");
      });
    });
  });
});
