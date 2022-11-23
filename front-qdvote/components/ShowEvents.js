import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./ShowEvents.module.css";
import {logit} from "../pages/index.js";

export default function ShowEvents() {
    const [Events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");
    const { chainId: chainIdHex, web3, isWeb3Enabled, account } = useMoralis();

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

    function createEvent() {

    };

    return (
        <div>
            <div>
            {isWeb3Enabled && (
                <div className={styles.section}>
                <h2 className={styles.title}>Create an Event {"📝"}</h2>
                <form onSubmit={createEvent} className={styles.forms}>
                    <input
                    type="text"
                    value={title}
                    placeholder="Title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    className = {styles.input}
                    />
                    <br />
                    <input
                    type="text"
                    value={id}
                    placeholder="ID"
                    required
                    onChange={(e) => setId(e.target.value)}
                    className = {styles.input}
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
            <div>
                {Events.map((each) => (
                <div className={styles.events} onClick={logit}>Event {each.id}:
                <br></br>
                <br></br>
                {each.title}</div>
                ))}
            </div>
        </div>
      );

}