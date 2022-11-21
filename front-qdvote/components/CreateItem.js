import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./CreateItem.module.css";
export default function CreateItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { chainId: chainIdHex, web3, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const quadraticVotingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  //   const { runContractFunction: contractCount } = useWeb3Contract({
  //     abi: abi,
  //     contractAddress: quadraticVotingAddress,
  //     functionName: "itemCount",
  //     params: {},
  //   });
  const { runContractFunction: contractCreateItem } = useWeb3Contract({
    abi: abi,
    contractAddress: quadraticVotingAddress,
    functionName: "createItem",
    params: {
      title: ethers.utils.hexZeroPad(utils.utf8ToHex(title), 32),
      description: description,
    },
  });

  async function createItem(e) {
    e.preventDefault();
    await contractCreateItem();
  }
  //   async function itemCount() {
  //     console.log("counts:", parseInt(await contractCount()));
  //     console.log("account:", account);
  //   }

  return (
    <div>
      {isWeb3Enabled && (
        <div className={styles.section}>
          <h2>Create Event</h2>
          <form onSubmit={createItem} className={styles.forms}>
            <input
              type="text"
              value={title}
              placeholder="Title"
              required
              onChange={(e) => setTitle(e.target.value)}
              className = {styles.input}
            />
            <br />
            <textarea
              value={description}
              placeholder="Description"
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <input type="submit" className= {styles.button}/>
          </form>
          {/* <button onClick={itemCount}>Count Item</button> */}
        </div>
      )}
      {!isWeb3Enabled && (
        <div>
          <h1>Welcome!</h1>
          <h2>connect ur wallet first!</h2>{" "}
        </div>
      )}
    </div>
  );
}
