import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { useContract } from "wagmi";
import { ethers } from "ethers";
import { utils } from "web3";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
// import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
export default function CreateItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const { chainId: chainIdHex, web3, isWeb3Enabled, account } = useMoralis();
  // const chainId = parseInt(chainIdHex);
  const { address, isConnected } = useAccount();
  const chainId = 31337;
  const quadraticVotingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  // const { runContractFunction: contractCount } = useWeb3Contract({
  //   abi: abi,
  //   contractAddress: quadraticVotingAddress,
  //   functionName: "itemCount",
  //   params: {},
  // });
  // const { runContractFunction: contractCreateItem } = useWeb3Contract({
  //   abi: abi,
  //   contractAddress: quadraticVotingAddress,
  //   functionName: "createItem",
  //   params: {
  //     title: ethers.utils.hexZeroPad(utils.utf8ToHex(title), 32),
  //     description: description,
  //   },
  // });
  const { refetch: contractCount } = useContractRead({
    address: quadraticVotingAddress,
    abi: abi,
    functionName: "itemCount",
  });
  const { config } = usePrepareContractWrite({
    address: quadraticVotingAddress,
    abi: abi,
    functionName: "createItem",
    args: [ethers.utils.hexZeroPad(utils.utf8ToHex(title), 32), description],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  async function createItem(e) {
    e.preventDefault();
    console.log("create ITEM jya");
    console.log("status", isSuccess);
    await write();
    console.log("done");
  }
  async function itemCount() {
    const { data } = await contractCount();
    console.log("count:", parseInt(data));
    console.log("address", address);
  }

  return (
    <div>
      {isConnected && (
        <div>
          <form onSubmit={createItem}>
            <input
              type="text"
              value={title}
              placeholder="Title"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <textarea
              value={description}
              placeholder="Description"
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <input type="submit" />
          </form>
          <button onClick={itemCount}>Count Item</button>
        </div>
      )}
      {!isConnected && (
        <div>
          <h1>Welcome!</h1>
          <h2>connect ur wallet first!</h2>{" "}
        </div>
      )}
    </div>
  );
}
