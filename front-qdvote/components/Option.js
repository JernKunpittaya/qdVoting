import { useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./Option.module.css";
export default function Option({ props }) {
  const [weight, setWeight] = useState(0);
  const [startWeight, setStartWeight] = useState(0);
  const [totalPosVotes, setTotalPosVotes] = useState(0);
  const [totalNegVotes, setTotalNegVotes] = useState(0);
//   const [cost, setCost] = useState(0);
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
      const posWeight = await currentWeight(props.eventId, props.optionId, true);
      const negWeight = await currentWeight(props.eventId, props.optionId, false);
      const globalPosVotes = await getPositiveVotes();
      const globalNegVotes = await getNegativeVotes();
      setTotalPosVotes( globalPosVotes.toNumber() );
      setTotalNegVotes( globalNegVotes.toNumber() );
      setWeight(posWeight - negWeight);
      setStartWeight(posWeight - negWeight);
    };
    if (isWeb3Enabled) {
      e_setWeight();
    }
  }, [isWeb3Enabled]);

  async function currentWeight(eventId, optionId, isPositive) {
    if (isPositive) {
        return await contract.getVoterOpPositiveWeight(eventId, optionId);
    } else {
        return await contract.getVoterOpNegativeWeight(eventId, optionId);
    }
  }

//   async function calcCost(currWeight, weight) {
//     return await contract.Poll.calcCost(currWeight, weight);
//   }

//   async function positiveVote(eventId, optionId, weight) {
//     // console.log("POSvote");
//     return await contract.positiveVote(eventId, optionId, weight);
//   }
//   async function negativeVote(itemId, weight, cost) {
//     // console.log("negvote");
//     return await contract.negativeVote(itemId, weight, {
//       value: cost,
//     });
//   }

  async function getPositiveVotes() {
    return await contract.getOpPositiveWeight(props.eventId, props.optionId);

  }

  async function getNegativeVotes() {
    return await contract.getOpNegativeWeight(props.eventId, props.optionId);
  }

  function upvote() {
    setWeight(weight + 1);
  }

  function downvote() {
    setWeight(weight - 1);
  }
  
//   useEffect(() => {
//     const e_setCost = async () => {
//       //   console.log("new weight", weight);
//       if (weight == 0) {
//         setCost(0);
//       } else {
//         const isPositive = weight > 0;
//         const currWeight = await currentWeight(props.eventId, props.optionId, isPositive);
//         // console.log("curr", currWeight);
//         setCost(await calcCost(currWeight, Math.abs(weight)));
//       }
//     };
//     e_setCost();
//   }, [weight]);

  async function submitVote(e) {
    e.preventDefault();
    if (weight >= 0) {
      await contract.positiveVote(props.eventId, props.optionId, weight);
    } else if (weight < 0) {
      await contract.negativeVote(props.eventId, props.optionId, Math.abs(weight));
    }
  }

  return (
    <div>
      <h2 className={styles.optionsTitle}>{props.option.name}</h2>
      {/* No description right now, so comment out, later can add */}
      {/* <p>{props.option.description}</p>*/} 
      <p>Upvotes: {totalPosVotes}</p>
      <p>Downvotes: {totalNegVotes}</p>
      <button onClick={upvote} className={styles.clear_button}>{"👍"}</button>
      <button onClick={downvote} className={styles.clear_button}>{"👎"}</button>
      
      {weight !== startWeight && (
        <div>
            <p>Weight: {weight}</p>
            <p>Cost: {weight **2 * 10} gwei</p>
            <button onClick={submitVote} className={styles.solid_button}>Submit Vote</button>
        </div>
       )}
    </div>
  );
} //
