//const { network } = require("hardhat")
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying....");
  await deploy("QuadraticVoting", {
    contract: "QuadraticVoting",
    from: deployer,
    log: true,
  });
  console.log("Deployed");
};
module.exports.tags = ["all"];
