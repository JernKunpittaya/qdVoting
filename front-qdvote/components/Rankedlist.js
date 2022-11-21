import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import Item from "./Item.js";
import styles from "./Rankedlist.module.css";

export default function Rankedlist() {
  const [Items, setItems] = useState([]);
  const [len, setLen] = useState(0);
  const { chainId: chainIdHex, web3, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const quadraticVotingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  var contract;
  async function wait() {
    if (isWeb3Enabled) {
      contract = new ethers.Contract(
        quadraticVotingAddress,
        abi,
        web3.getSigner()
      );
      const final = await rankedItems();
      setLen(final.length);
    }
  }
  wait();
  useEffect(() => {
    const set = async () => {
      await rankedItems().then((result) => {
        setItems(result);
      });
    };
    set();
  }, [len]);
  async function items(itemId) {
    const item = await contract.items(itemId);
    //
    if (item) {
      return {
        id: itemId,
        owner: item.owner,
        amount: item.amount,
        title: utils.hexToUtf8(item.title), // bytes32 => string
        description: item.description,
        positiveWeight: item.totalPositiveWeight,
        negativeWeight: item.totalNegativeWeight,
      };
    } else {
      return null;
    }
  }

  async function itemCount() {
    return await contract.itemCount();
  }
  async function rankedItems() {
    const count = await itemCount();
    let itemsArr = [];

    for (let i = 0; i < count; i++) {
      const item = await items(i);
      if (item) itemsArr.push(item);
    }
    // console.log("Items", itemsArr);

    return itemsArr.sort((a, b) => {
      const netWeightB = b.positiveWeight - b.negativeWeight;
      const netWeightA = a.positiveWeight - a.negativeWeight;
      return netWeightB - netWeightA; // sort from greatest to least
    });
  }
  return (
    <div>
      <section>
        <h1 className={styles.title}>Ranked List</h1>
        {isWeb3Enabled && (
          <div className={styles.section}>
            {Items.map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
