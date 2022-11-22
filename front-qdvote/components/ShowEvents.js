import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";

export default function ShowEvents() {
    const [Events, setEvents] = useState([]);
    // hard code some events with an event array to mock display
    const event1 = {
        title: "Favorite Basketball Player",
        id: 101
    };
    const event2 = {
        title: "Where to vacation?",
        id: 201
    };
    const event3 = {
        title: "Best fruits",
        id: 301
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
              <p>Event {each.id}: {each.title}</p>
            ))}
        </div>
      );

}