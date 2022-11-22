import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./ShowEvents.module.css";
import {logit} from "../pages/index.js";

export default function ShowEvents() {
    const [Events, setEvents] = useState([]);
    // hard code some events with an event array to mock display
    const event1 = {
        title: "Favorite Basketball Player",
        id: 1
    };
    const event2 = {
        title: "Where to vacation?",
        id: 2
    };
    const event3 = {
        title: "Best fruits",
        id: 3
    };
    function pushToArray() {
        const arr = [];
        arr.push(event1, event2, event3);
        return arr;
    }
    useEffect(() => {
        setEvents(pushToArray());
    });

    return (
        <div>
            {Events.map((each) => (
              <div className={styles.events} onClick={logit}>Event {each.id}:
              <br></br>
              <br></br>
              {each.title}</div>
            ))}
        </div>
      );

}