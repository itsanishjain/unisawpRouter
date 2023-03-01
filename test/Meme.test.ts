import { BigNumber, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Meme } from "../typechain-types/index";
import MemeArtifact from "../artifacts/contracts/Fetch.sol/Fetch.json";

const { deployContract } = waffle;
const { expect } = chai;
chai.use(chaiAsPromised);
let user: SignerWithAddress;
let random: SignerWithAddress;
let contractOwner: SignerWithAddress;
let Meme: Meme;

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const MEME_DECIMALS = 18;
const oneMeme = 10 ** 18;

const formValue = (v: BigNumber) => {
  return ethers.utils.formatUnits(v, MEME_DECIMALS);
};

describe("Initialization of core functions", function () {
  beforeEach(async function () {
    [contractOwner, user, random] = await ethers.getSigners();

    Meme = (await deployContract(contractOwner, MemeArtifact)) as Meme;
  });

  describe("Meme Contract", function () {
    it("Check total supply of MKT", async function () {
      const pair = await Meme.uniswapV2Pair();
      console.log({ pair });

      console.log("tokensForLiquidity", await Meme.tokensForLiquidity());
      console.log("tokensForMarketing", await Meme.tokensForMarketing());

      console.log("QQQQQQQ", await Meme.automatedMarketMakerPairs(pair));

      await Meme.transfer(user.address, 500);

      const userBalanceBeforeTransfer = await Meme.connect(
        contractOwner
      ).balanceOf(user.address);

      console.log(userBalanceBeforeTransfer);

      // console.log(formValue(userBalanceBeforeTransfer));

      // await Meme.removeLimits();

      await Meme.connect(user).transfer(random.address, 100);
      await Meme.connect(user).transfer(pair, 100);

      console.log("tokensForLiquidity", await Meme.tokensForLiquidity());
      console.log("tokensForMarketing", await Meme.tokensForMarketing());

      const userBalance = await Meme.connect(contractOwner).balanceOf(
        user.address
      );

      const randomBalance = await Meme.connect(contractOwner).balanceOf(
        random.address
      );

      // const newB = await Meme.connect(contractOwner).balanceOf(Meme.address);

      console.log("ETH", await user.getBalance());

      // console.log(
      //   "User balace",
      //   ethers.utils.formatUnits(userBalance, MEME_DECIMALS)
      // );
      // console.log(
      //   "Random balace",
      //   ethers.utils.formatUnits(randomBalance, MEME_DECIMALS)
      // );

      console.log("USER", userBalance);
      console.log("RANDOM", randomBalance);
    });
  });
});

// 0.000 000 000 000 000 3
