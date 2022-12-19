const { ethers } = require("hardhat")
const fs = require("fs")
const FRONT_END_ADDRESSES_FILE = "../front-qdvote/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../front-qdvote/constants/abi.json"
const LOCALHOST_DEPLOY = "./deployments/localhost/Factory.json"
const MATIC_DEPLOY = "./deployments/matic/Factory.json"
const { network } = require("hardhat")

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        updateContractAddresses()
        updateAbi()
        console.log("Front end written!")
    }
}
async function updateAbi() {
    // const factoryVoting = await ethers.getContract("Factory")
    const chainId = network.config.chainId.toString()
    var deployment
    if (chainId == 31337) {
        deployment = JSON.parse(fs.readFileSync(LOCALHOST_DEPLOY, "utf8"))
    } else {
        deployment = JSON.parse(fs.readFileSync(MATIC_DEPLOY, "utf8"))
    }
    // fs.writeFileSync(
    //     FRONT_END_ABI_FILE,
    //     factoryVoting.interface.format(ethers.utils.FormatTypes.json)
    // )
    fs.writeFileSync(FRONT_END_ABI_FILE, deployment.abi)
}

async function updateContractAddresses() {
    // const factoryVoting = await ethers.getContract("Factory")
    const chainId = network.config.chainId.toString()
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    var deployment
    if (chainId == 31337) {
        deployment = JSON.parse(fs.readFileSync(LOCALHOST_DEPLOY, "utf8"))
    } else {
        deployment = JSON.parse(fs.readFileSync(MATIC_DEPLOY, "utf8"))
    }
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(deployment.address)) {
            currentAddresses[chainId].push(deployment.address)
        }
    }
    {
        currentAddresses[chainId] = [deployment.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]
