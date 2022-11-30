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
    const [fields, setFields] = useState([10]); // number of textfields for options
    const [options, setOptions] = useState([{name:"", description:""}]) // options of the current Event
    // 1. is Home, 2. is inside an event to vote (rankedlist), 3. create an event page
    const [currentPage, setCurrentPage] = useState(1); 

    function clickBack() {
        setCurrentPage(1);
    };

    function clickRanklist(e, each) {
        e.preventDefault();
        setCurrentPage(2);
        setTitle(each.title);
        setId(each.id);
        setOptions(each.options);
    };

    function clickCreateEventPage() {
        setCurrentPage(3);
    }

    function addFormFields() {
        setFields([...fields, 1]);
    }

    function removeFormFields(index) {
        const temp_fields = [...fields];
        temp_fields.splice(index, 1);
        setFields(temp_fields);

        const temp_options = [...options];
        temp_options.splice(index, 1);
        setOptions(temp_options);
    }

    function addOption(e, index) {
        var temp = [];
        if (index > options.length-1) {
            temp = [...options, {name:"", description:""}]
        } else {
            temp = [...options];
        }
        temp[index][e.target.name] = e.target.value;
        setOptions(temp);
    }

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
        setEvents([...Events, { title: title, id: Events.length+1, options: options }]);
        console.log(Events);
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
                <p>Please vote for the option(s) that you like!</p> 
                <div>
                    {options.map((each) => (
                        <div className={styles.optionsSection}>
                            <h2 className={styles.optionsTitle}> {each.name} </h2>
                            <p> {each.description} </p>
                            <button className={styles.clear_button}>Up</button>
                            <button className={styles.clear_button}>Down</button>
                        </div>
                    ))}
                </div>
                {/* <Rankedlist /> */}
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
                        // value={title}
                        placeholder="Title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        className = {styles.input}
                        />
                        <br />
                        <h3 className={styles.title}>& enter options to vote on:</h3>
                        { fields.map((element, index) => (
                            <div>
                                <input
                                type="text"
                                name="name"
                                placeholder= {"Option " + (index+1)}
                                required
                                onChange={(e) => addOption(e, index)}
                                className = {styles.input}
                                />
                                <br />
                                <textarea
                                type = "text"
                                name = "description"
                                placeholder="Description"
                                required
                                onChange={(e) => addOption(e, index)}
                                rows="2"
                                cols="40"
                                />
                                <br />
                                {  index ?
                                    <div>
                                        <button className = {styles.removeButton} onClick={() => removeFormFields(index) }>X</button>
                                        <br />
                                    </div>
                                    : null
                                }
                                <br />
                            </div>
                        ))}
                        <button className = {styles.addButton} onClick={ addFormFields }>Add</button>
                        <br /><br />
                        <input type="submit" className= {styles.button}/>
                    </form>
                    {/* <CreateItem /> */}
                </div>
            </div>
        )}
        </div>

      );

}