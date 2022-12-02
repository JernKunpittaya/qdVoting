//const { network } = require("hardhat")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    console.log("Deploying....")
    await deploy("Factory", {
        contract: "Factory",
        from: deployer,
        log: true,
    })
    console.log("Deployed")
}
module.exports.tags = ["all"]
