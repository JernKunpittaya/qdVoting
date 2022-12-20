const { assert } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const web3 = require("web3")
const { abi } = require("../artifacts/contracts/Poll.sol/Poll.json")
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
describe("Factory Contract", function () {
    let deployer
    let Factory
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        Factory = await ethers.getContract("Factory", deployer)
    })
    it("Should create poll successfully", async function () {
        const [, eligible1, eligible2] = await ethers.getSigners()
        await Factory.createPoll(
            "pet",
            [eligible1.address, eligible2.address],
            ["dog", "cat", "fish"],
            10
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
        assert.equal(await Factory.getvalidSeconds(0), 10)
        assert.equal(await Factory.isActive(0), true)
    })
    it("Should be a valid contract address", async function () {
        let address = Factory.address
        console.log("address", address)
        assert.notEqual(address, null)
        assert.notEqual(address, 0x0)
        assert.notEqual(address, "")
        assert.notEqual(address, undefined)
    })
})
describe("Poll Contract", function () {
    let Factory
    beforeEach(async function () {
        const [deployer, eligible1, eligible2] = await ethers.getSigners()
        await deployments.fixture(["all"])
        Factory = await ethers.getContract("Factory", deployer.address)
    })
    it("Non eligible voter cannot vote, has credit 0", async function () {
        const [, eli1, eli2, non_eligible] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 10)
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
    it("Eligible voter, credit + option weight change correctly", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 10)
        assert.equal(await Factory.getCredit(0, eli1.address), 100)
        await Factory.connect(eli1).positiveVote(0, 0, 3)
        assert.equal(await Factory.getCredit(0, eli1.address), 91)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 3)
    })
    it("Eligible voter has credit 100", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 10)
        assert.equal(await Factory.getCredit(0, eli1.address), 100)
    })

    it("Eligible voter can change their vote", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 10)
        assert.equal(await Factory.getCredit(0, eli1.address), 100)
        await Factory.connect(eli1).positiveVote(0, 0, 3)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 3)
        assert.equal(await Factory.getCredit(0, eli1.address), 91)
        await Factory.connect(eli1).positiveVote(0, 0, 6)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 6)
        assert.equal(await Factory.getCredit(0, eli1.address), 64)
        await Factory.connect(eli1).positiveVote(0, 0, 5)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 5)
        assert.equal(await Factory.getCredit(0, eli1.address), 75)
    })
    it("Eligible voter change positive, negative vote correctly", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 10)
        assert.equal(await Factory.getCredit(0, eli1.address), 100)
        await Factory.connect(eli1).positiveVote(0, 0, 3)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 3)
        assert.equal(await Factory.getOpNegativeWeight(0, 0), 0)
        assert.equal(await Factory.getCredit(0, eli1.address), 91)
        await Factory.connect(eli1).negativeVote(0, 0, 5)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 0)
        assert.equal(await Factory.getOpNegativeWeight(0, 0), 5)
        assert.equal(await Factory.getCredit(0, eli1.address), 75)
        await Factory.connect(eli1).positiveVote(0, 0, 4)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 4)
        assert.equal(await Factory.getOpNegativeWeight(0, 0), 0)
        assert.equal(await Factory.getCredit(0, eli1.address), 84)
    })
    it("2 Eligible voter makes correct overall weight for option", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 10)
        await Factory.connect(eli1).positiveVote(0, 0, 3)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 3)
        assert.equal(await Factory.getOpNegativeWeight(0, 0), 0)
        assert.equal(await Factory.getCredit(0, eli1.address), 91)
        await Factory.connect(eli2).positiveVote(0, 0, 5)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 8)
        assert.equal(await Factory.getOpNegativeWeight(0, 0), 0)
        assert.equal(await Factory.getCredit(0, eli2.address), 75)

        await Factory.connect(eli1).negativeVote(0, 0, 4)
        assert.equal(await Factory.getOpPositiveWeight(0, 0), 5)
        assert.equal(await Factory.getOpNegativeWeight(0, 0), 4)
        assert.equal(await Factory.getCredit(0, eli1.address), 84)
    })
    it("Cannot Vote after time expires", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 5)
        console.log("waiting for >5 seconds")
        await sleep(6000)
        try {
            await Factory.connect(eli1).positiveVote(0, 0, 5)
        } catch (err) {
            assert.include(err.message, "revert", "Poll time expired!")
        }
    })
    it("Eligible voter can't vote more than 100 credit", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 10)
        assert.equal(await Factory.getCredit(0, eli1.address), 100)
        try {
            await Factory.connect(eli1).positiveVote(0, 0, 11)
        } catch (err) {
            assert.include(err.message, "revert", "Not enough credit")
        }
    })
    it("Cannot get result before time expires", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 5)
        var result
        try {
            result = await Factory.connect(eli1).getresult(0)
        } catch (err) {
            assert.include(err.message, "revert", "Poll time not expired yet!")
        }
    })
    it("Get correct result after time expires", async function () {
        const [, eli1, eli2] = await ethers.getSigners()
        await Factory.createPoll("pet", [eli1.address, eli2.address], ["dog", "cat", "fish"], 5)
        await Factory.connect(eli1).positiveVote(0, 0, 3)
        await Factory.connect(eli2).positiveVote(0, 1, 7)
        console.log("waiting for >5 seconds")
        await sleep(6000)
        await Factory.publishResult(0)
        assert.equal(await Factory.connect(eli1).getresult(0), 1)
    })
})
