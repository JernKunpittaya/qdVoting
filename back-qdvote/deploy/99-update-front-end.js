const { ethers } = require("hardhat")
const fs = require("fs")
const FRONT_END_ADDRESSES_FILE = "../front-qdvote/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../front-qdvote/constants/abi.json"
const { network } = require("hardhat")

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        updateContractAddresses()
        updateAbi()
    }
}
async function updateAbi() {
    const quadraticVoting = await ethers.getContract("QuadraticVoting")
    fs.writeFileSync(
        FRONT_END_ABI_FILE,
        quadraticVoting.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const quadraticVoting = await ethers.getContract("QuadraticVoting")
    const chainId = network.config.chainId.toString()
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(quadraticVoting.address)) {
            currentAddresses[chainId].push(quadraticVoting.address)
        }
    }
    {
        currentAddresses[chainId] = [quadraticVoting.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]
