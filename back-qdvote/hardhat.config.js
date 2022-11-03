const fs = require("fs")
require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

const MATIC_RPC_URL = process.env.MATIC_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
    solidity: "0.8.17",
    defaultNetwork: "hardhat",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
        matic: {
            url: MATIC_RPC_URL,
            chainId: 80001,
            confirmations: 2,
            accounts: [PRIVATE_KEY],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}
