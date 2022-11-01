const { expect } = require("chai");
// Chai docs: https://www.chaijs.com/api/bdd/
const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("VolcanoCoin", function() {
    // SETUP
    async function SETUP() {
        const VolcanoCoin = await hre.ethers.getContractFactory("VolcanoCoin");
        const volcanoCoin = await VolcanoCoin.deploy();
        return {volcanoCoin, VolcanoCoin};
    }

    it("Should check if the initial supply is 10000", async function () {
        // Initial supply of 10_000 but I wonder about gweis.
        const {volcanoCoin, VolcanoCoin} = await SETUP();
        expect(await volcanoCoin.getSupply()).to.equal(10000);
    });
    it("Should revert with not enough funds", async function () {
        const [owner , otherAccount] = await ethers.getSigners();
        const {volcanoCoin, VolcanoCoin} = await SETUP();
        // await expect(volcanoCoin.transfer("0x4675C7e5BaAFBFFbca748158bEcBA61ef3b0a263", 1000000)).to.be.revertedWith("Not enough fund in your wallet!");
        await expect(volcanoCoin.transfer(otherAccount.address, 1000000)).to.be.revertedWith("Not enough fund in your wallet!");
    });
    it("Should test whether supply increase by correct amount", async function() {
        const {volcanoCoin, VolcanoCoin} = await SETUP();
        const totalSupply = await volcanoCoin.getSupply();
        volcanoCoin.addSupply();
        await expect(await volcanoCoin.getSupply()).to.equal(totalSupply.add(1000));
    });
    it("Should be only callable by owner you feel me", async function () {
        const {volcanoCoin, VolcanoCoin} = await SETUP();
        const [owner, account1, account2] = await ethers.getSigners();
        await expect(volcanoCoin.connect(account1).addSupply()).to.be.revertedWith("Ownable: caller is not the owner");
    });

});
