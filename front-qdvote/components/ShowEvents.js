// import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./ShowEvents.module.css";
import { renderMatches } from "react-router";
import { clickRanklist } from "../pages/index.js";
import CreateItem from "../components/CreateItem";
import Rankedlist from "../components/Rankedlist";

export default function ShowEvents() {
    const [Events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [id, setId] = useState(0);
    // const [clickedCreateEventPage, setClickCreateEventPage] = useState(false);
    
    // 1. is Home, 2. is inside event to vote, 3. create an event
    const [currentPage, setCurrentPage] = useState(1); 

    function clickBack() {
        setCurrentPage(1);
    };

    function clickRanklist(e, each) {
        e.preventDefault();
        setCurrentPage(2);
        setTitle(each.title);
        setId(each.id);
    };

    function clickCreateEventPage(){
        setCurrentPage(3);
    }

    // function clickCreateEventPage() {
    //     setClickCreateEventPage(true);
    // }

    // function backToHomePage() {
    //     setClickCreateEventPage(false);
    // }

    // hard code some events with an event array to mock display
    // const event1 = {
    //     title: "Favorite Basketball Player",
    //     id: 1
    // };
    // const event2 = {
    //     title: "Where to vacation?",
    //     id: 2
    // };
    // const event3 = {
    //     title: "Best fruits",
    //     id: 3
    // };
    // function pushToArray() {
    //     const arr = [];
    //     arr.push(event1, event2, event3);
    //     return arr;
    // }

    useEffect(() => {
        
    });

    function createEvent(e) {
        e.preventDefault();
        // ID is auto incrementing
        setEvents([...Events, { title: title, id: Events.length+1 }]);
        alert("Event Successfully Created");
    };

    return (
        <div>
        {currentPage == 1 && (
            <div>
                <div >
                    <div className={styles.forms3}>
                        <button 
                        className={styles.button} 
                        onClick={clickCreateEventPage}>
                        Create An Event
                        </button>
                    </div>
                    <div>
                        <p>Welcome to our Decentralized Voting App!</p>
                        <p> 
                        Create an event above for others to vote on or
                        select an existing event below to vote on!
                        </p>
                        <h2 className={styles.title}>Events:</h2>
                        <div>
                        {Events.map((each) => (
                        <div className={styles.events} onClick={ (e) => clickRanklist(e, each) }>
                        Event {each.id}:
                        <br></br>
                        <br></br>
                        {each.title}</div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
        {currentPage == 2 && (
            <div>
                <button onClick={clickBack}>Back</button>
                <h2 className={styles.forms}>Event {id}: {title}</h2>
                <Rankedlist />
            </div>
        )}
        {currentPage == 3 && (
            <div>
                <button onClick={clickBack}>Back</button>
                <div>
                    <h2 className={styles.title}>Create an Event {"📝"}</h2>
                    <form onSubmit={createEvent} className={styles.forms2}>
                        <input
                        type="text"
                        value={title}
                        placeholder="Title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        className = {styles.input}
                        />
                        <br />
                        {/* <input
                        type="text"
                        value={id}
                        placeholder="ID"
                        required
                        onChange={(e) => setId(e.target.value)}
                        className = {styles.input}
                        />
                        <br /> */}
                        <input type="submit" className= {styles.button}/>
                    </form>
                    <CreateItem />
                </div>
                {/* <Rankedlist /> */}
            </div>
        )}
        </div>

      );

}