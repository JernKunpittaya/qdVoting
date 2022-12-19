const { assert } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const web3 = require("web3")
const { abi } = require("../artifacts/contracts/Poll.sol/Poll.json")
describe("Factory Contract", function () {
    let deployer
    let Factory
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        Factory = await ethers.getContract("Factory", deployer)
    })
    it("should be a valid contract address", async function () {
        let address = Factory.address
        console.log("address", address)
        assert.notEqual(address, null)
        assert.notEqual(address, 0x0)
        assert.notEqual(address, "")
        assert.notEqual(address, undefined)
    })

    it("should create poll successfully", async function () {
        const [, eligible1, eligible2] = await ethers.getSigners()
        await Factory.createPoll(
            "pet",
            [eligible1.address, eligible2.address],
            ["dog", "cat", "fish"],
            3
        )
        assert.equal(await Factory.getNumEvents(), 1)
        assert.equal(await Factory.getTitle(0), "pet")
        assert.equal(await Factory.getNumEligibles(0), 2)
        assert.equal(await Factory.getEligible(0, 0), eligible1.address)
        assert.equal(await Factory.getEligible(0, 1), eligible2.address)
        assert.equal(await Factory.getNumOptions(0), 3)
        assert.equal(await Factory.getOpTitle(0, 0), "dog")
        assert.equal(await Factory.getOpTitle(0, 1), "cat")
        assert.equal(await Factory.getOpTitle(0, 2), "fish")
        assert.equal(await Factory.getvalidSeconds(0), 180)
        assert.equal(await Factory.isActive(0), true)
    })
})
describe("Poll Contract", function () {
    let Factory
    beforeEach(async function () {
        const [deployer, eligible1, eligible2] = await ethers.getSigners()
        await deployments.fixture(["all"])
        Factory = await ethers.getContract("Factory", deployer.address)
        await Factory.createPoll(
            "pet",
            [eligible1.address, eligible2.address],
            ["dog", "cat", "fish"],
            3
        )
    })
    it("Non eligible voter cannot vote, has credit 0", async function () {
        const [, , , non_eligible] = await ethers.getSigners()
        assert.equal(await Factory.getCredit(0, non_eligible.address), 0)
        try {
            await Factory.connect(non_eligible).positiveVote(0, 0, 1)
        } catch (err) {
            assert.include(err.message, "revert", "Not eligible")
        }
        try {
            await Factory.connect(non_eligible).negativeVote(0, 0, 1)
        } catch (err) {
            assert.include(err.message, "revert", "Not eligible")
        }
    })
    it("Non eligible voter cannot vote, has credit 0", async function () {
        const [, , , non_eligible, outsider] = await ethers.getSigners()
        assert.equal(await Factory.getCredit(0, non_eligible.address), 0)
        try {
            await Factory.connect(non_eligible).positiveVote(0, 0, 1)
        } catch (err) {
            assert.include(err.message, "revert", "Not eligible")
        }
        try {
            await Factory.connect(non_eligible).negativeVote(0, 0, 1)
        } catch (err) {
            assert.include(err.message, "revert", "Not eligible")
        }
    })
    it("Eligible voter has credit 100", async function () {
        const [, , eli1] = await ethers.getSigners()
        assert.equal(await Factory.getCredit(0, eli1.address), 100)
    })
})
