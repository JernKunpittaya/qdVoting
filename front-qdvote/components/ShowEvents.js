import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./ShowEvents.module.css";
import { renderMatches } from "react-router";
import CreatePoll from "../components/CreatePoll";
import Option from "../components/Option";
// import CreateItem from "../components/CreateItem";
// import Rankedlist from "../components/Rankedlist";

export default function ShowEvents() {
    const [Events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [id, setId] = useState(0);
    const [options, setOptions] = useState([{name:"", description:""}]); // options of the current Event
    const [credits, setCredits] = useState(0);
    const [deployTime, setDeployTime] = useState(0); // deploy time of a contract
    const [currentTime, setCurrentTime] = useState(new Date()); // current time in react
    const [validTime, setValidTime] = useState(0); // valid time until expire of a contract
    // 1. is Home, 2. is inside an event to vote (rankedlist), 3. create an event page
    const [currentPage, setCurrentPage] = useState(1); 
    const d = new Date();
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
    };
    start();

    // // Get the number of events
    // const { runContractFunction: contractGetNumEvents } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: quadraticVotingAddress,
    //     functionName: "getNumEvents",
    //     params: {},
    // });

    function clickBack() {
        setCurrentPage(1);
    };

    function clickRanklist(e, each) {
        e.preventDefault();
        setCurrentPage(2);
        setTitle(each.title);
        setId(each.id);
        setOptions(each.options);
        setDeployTime(each.deployTime);
        setValidTime(each.validSeconds);
    };

    function clickCreateEventPage() {
        setCurrentPage(3);
    };

    async function getNumEvents() {
        return await contract.getNumEvents();
    };

    // called by useEffect() to setEvents to all of the events in the contract
    async function getAllEvents() {
        const count = await getNumEvents();
        let eventArr = [];
        for (let i = 0; i < count; i++) {
          const _event = await getOneEvent(i);
          _event.id = i; // here is 0 index like in solidity contract, +1 index only for display in frontend
          if (_event) eventArr.push(_event);
        }
        return eventArr;
    };

    // called by getAllEvents() to get an single event by Id
    async function getOneEvent(eventID) {
        const eventTitle = await contract.getTitle(eventID);
        const eventOptions = await getAllOptions(eventID);
        const eventSeconds = await contract.getvalidSeconds(eventID);
        const eventDeploy = await contract.getdeployTime(eventID);
        const eventActive = await contract.getIsActive(eventID);
        var optionArr = [];
        for (let i = 0; i < eventOptions.length; i++) {
            optionArr.push({name: eventOptions[i], description: "N/A"})
        }

        if (eventTitle) {
          return {
            title: eventTitle,
            id: 0, // placeholder, gets changed in the next function stack call
            options: optionArr,
            deployTime: eventDeploy.toNumber(),
            validSeconds: eventSeconds.toNumber(),
            isActive: eventActive // placeholder, all events start out as active
          };
        } else {
          return null;
        }
    };

    // called by getOneEvent() to get all the options of an event,
    async function getAllOptions(eventID) {
        const count = await contract.getNumOptions(eventID);
        var optionArr = [];
        for (let i = 0; i < count; i++) {
            const _option = await getOneOption(eventID, i);
            if (_option) optionArr.push(_option);
          }
          return optionArr;
    };

    // called by getAllOptions() to get one option
    async function getOneOption(eventID, optionID) {
        const optionTitle = await contract.getOpTitle(eventID, optionID);

        if (optionTitle) {
            return optionTitle;
          } else {
            return null;
          }
    };

    async function getRemainingCredits(eventID, voterID) {
        const credits = await contract.getCredit(eventID, voterID);
        setCredits(credits.toNumber());
    };

    async function getResult() {
        // const res = await contract.getresult(id);
        // await contract.publishResult(id);
        const res = await contract.getresult(id);
        console.log(res.toNumber());
        alert("The Winning Option Is: " + options[res.toNumber()].name + "!");
    }

    // calculate what time to display
    function calcDisplayTime() {
        const time = validTime - (Math.round(currentTime/1000) - deployTime)
        if (time < 0) {
            return "Expired"
        }
        return time + " seconds"
    }

    function isExpired() {
        const time = validTime - (Math.round(currentTime/1000) - deployTime)
        if (time < 0) {
            return true
        } else {
            return false
        }
    }

    // called on start to load all events on home page (page = 1)
    useEffect(() => {
        const set = async () => {
            await getAllEvents().then((result) => {
              setEvents(result);
            });
          };
        set();
    }, []);

    // load remaining credits of an event on rankedlist page (page = 2)
    useEffect(() => {
        const cred = async () => {
            await getRemainingCredits(id, account);
        };    
        cred();
    });

    // function to update the display for time remaining every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
                                <div 
                                className={styles.events} 
                                onClick={ (e) => clickRanklist(e, each) }
                                key={each.id}
                                >
                                    {/* plus 1 indexing for display only */}
                                    Event {each.id+1}:
                                    <br></br>
                                    <br></br>
                                    {each.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
        {currentPage == 2 && (
            <div>
                <button onClick={clickBack}>Back</button>
                <p>Your Credits Remaining: {credits}</p>
                {/* plus 1 index for display only */}
                <h2 className={styles.forms}>Event {id+1}: {title}</h2>
                <div className={styles.infoBox}>
                    <p>Deploy Time: {deployTime}</p>
                    <p>Valid Seconds: {validTime}</p>
                    <p>Poll Expires in: {calcDisplayTime()}</p>
                    { isExpired() == true && (
                    <div>
                        <button 
                        className={styles.buttonRed} 
                        onClick={getResult}>
                        Get Results
                        </button>
                    </div>
                    )}
                </div>
                <p>Please vote for the option(s) that you like!</p>
                <div>
                    {options.map((each, index) => (
                        <div className={styles.optionsSection} key={index}>
                            <Option key={index} props={{option: each, optionId: index, eventId: id}}/>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {currentPage == 3 && (
            <div>
                <button onClick={clickBack}>Back</button>
                <CreatePoll />
            </div>
        )}
        </div>
      );
}