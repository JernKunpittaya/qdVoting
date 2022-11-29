import { useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./Item.module.css";
export default function Item({ item }) {
  const [weight, setWeight] = useState(0);
  const [rep, setRep] = useState(0);
  const [startWeight, setStartWeight] = useState(0);
  const [cost, setCost] = useState(0);
  const { chainId: chainIdHex, web3, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const quadraticVotingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  var contract;
  async function start() {
    if (isWeb3Enabled) {
      contract = new ethers.Contract(
        quadraticVotingAddress,
        abi,
        web3.getSigner()
      );
    }
  }
  start();

  useEffect(() => {
    const e_setWeight = async () => {
      //   console.log("Hey");
      const posWeight = await currentWeight(item.id, true);
      const negWeight = await currentWeight(item.id, false);
      setWeight(posWeight - negWeight);
      setStartWeight(posWeight - negWeight);
    };
    if (isWeb3Enabled) {
      e_setWeight();
    }
  }, [isWeb3Enabled]);

  async function currentWeight(itemId, isPositive) {
    // console.log("Now acc", account);
    return await contract.currentWeight(itemId, account, isPositive);
  }
  async function calcCost(currWeight, weight) {
    return await contract.calcCost(currWeight, weight);
  }

  async function positiveVote(itemId, weight, cost) {
    // console.log("POSvote");
    return await contract.positiveVote(itemId, weight, {
      value: cost,
    });
  }
  async function negativeVote(itemId, weight, cost) {
    // console.log("negvote");
    return await contract.negativeVote(itemId, weight, {
      value: cost,
    });
    // return await contract.methods
    //   .negativeVote(itemId, weight)
    //   .send({ from: account, value: cost });
  }
  async function claim(itemId) {
    return await contract.claim(itemId);
  }
  function upvote() {
    setWeight(weight + 1);
  }
  function downvote() {
    setWeight(weight - 1);
  }
  //
  useEffect(() => {
    const e_setCost = async () => {
      //   console.log("new weight", weight);
      if (weight == 0) {
        setCost(0);
      } else {
        const isPositive = weight > 0;
        const currWeight = await currentWeight(item.id, isPositive);
        // console.log("curr", currWeight);
        setCost(await calcCost(currWeight, Math.abs(weight)));
      }
    };
    e_setCost();
  }, [weight]);

  async function submitVote(e) {
    e.preventDefault();
    if (weight >= 0) {
      await positiveVote(item.id, weight, cost);
    } else if (weight < 0) {
      await negativeVote(item.id, Math.abs(weight), cost);
    }
  }
  async function claimGwei() {
    await claim(item.id); //transfer rewards to owner wallet.
  }
  //
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>{item.title}</h2>
      <p>{item.description}</p>
      <p>{item.owner}</p>
      {account.toLowerCase() == item.owner.toLowerCase() && (
        <div>
          <p>Amount: {item.amount / 1_000_000_000} gwei</p>
          <button onClick={claimGwei}>Claim</button>
        </div>
      )}

      {account.toLowerCase() != item.owner.toLowerCase() && (
        <div>
          <button onClick={upvote} className={styles.clear_button}>Up</button>
          <p>Upvotes: {item.positiveWeight.toNumber()}</p>
          <button onClick={downvote} className={styles.clear_button}>Down</button>
          <p>Downvotes: {item.negativeWeight.toNumber()}</p>
          {weight !== startWeight && (
            <div>
              <p>Weight: {weight}</p>
              <p>Cost: {cost / 1_000_000_000} gwei</p>
              <button onClick={submitVote} className={styles.solid_button}>Submit Vote</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} //
