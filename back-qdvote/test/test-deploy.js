const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const web3 = require("web3");
describe("QuadraticVoting", function () {
  let deployer;
  let quadraticVoting;
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    quadraticVoting = await ethers.getContract("QuadraticVoting", deployer);
  });
  it("should be a valid contract address", async function () {
    let address = quadraticVoting.address;

    console.log("address", address);
    assert.notEqual(address, null);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, undefined);
  });

  it("should be the correct item data", async function () {
    await quadraticVoting.createItem(
      ethers.utils.hexZeroPad(web3.utils.utf8ToHex("Chewbacca"), 32),
      //"ipfs_hash",
      "The ultimate furry."
    );

    assert.equal(await quadraticVoting.itemCount(), 1);
    let item = await quadraticVoting.items(0);
    //console.log("item", item)
    assert.equal(web3.utils.hexToUtf8(item.title), "Chewbacca");
    //assert.equal(item.imageHash, "ipfs_hash")
    assert.equal(item.description, "The ultimate furry.");
  });
});
