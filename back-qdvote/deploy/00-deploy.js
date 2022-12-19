const { network, ethers } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log("Deploying....")
    await deploy("Factory", {
        from: deployer,
        log: true,
    })
    console.log("Deployed")
}
module.exports.tags = ["all"]
