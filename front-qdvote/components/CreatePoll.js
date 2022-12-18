import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./CreatePoll.module.css";

export default function CreatePoll() {
    const [title, setTitle] = useState("");
    // const [id, setId] = useState(0);
    const [fields, setFields] = useState([1]); // number of textfields for options
    const [eligibleFields, setEligibleFields] = useState([1]); // number of textfields for eligible voters
    const [eligibles, setEligibles] = useState([""]); // addresses that are eligible to vote
    const [options, setOptions] = useState([{name:"", description:""}]) // options of the current Event
    const [validMins, setValidMins] = useState(30); // default 30 minutes
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

    // const { runContractFunction: contractCreatePoll } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: quadraticVotingAddress,
    //     functionName: "createPoll",
    //     params: {
    //         _title: title,
    //         _eligibles: ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
    //         _opTitle: optionTitles,
    //     },
    // });

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

    function addEligibleFormFields() {
        setEligibleFields([...eligibleFields, 1]);
    }

    function removeEligibleFormFields(index) {
        const temp_fields = [...eligibleFields];
        temp_fields.splice(index, 1);
        setEligibleFields(temp_fields);

        const temp_eligibles = [...eligibles];
        temp_eligibles.splice(index, 1);
        setEligibles(temp_eligibles);
    }

    function addEligibles(e, index) {
        var temp = [];
        if (index > eligibles.length-1) {
            temp = [...eligibles, e.target.value]
        } else {
            temp = [...eligibles];
        }
        temp[index] = e.target.value;
        setEligibles(temp);
    }

    async function createPoll(e) {
        e.preventDefault();
        // setEvents([...Events, { title: title, id: Events.length+1, options: options }]);

        // create an array of only the option name in the voting
        var optionNames = []
        for (let i = 0; i < options.length; i++) {
            optionNames.push(options[i]["name"])
        }
        console.log(title)
        console.log(optionNames);
        console.log(eligibles);
        console.log(validMins);
        await contract.createPoll(title, eligibles, optionNames, validMins);
        alert("Event Successfully Created");
    };

    return (
        <div>
            <h2 className={styles.title}>Create an Event {"📝"}</h2>
            <form onSubmit={createPoll} className={styles.forms2}>
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
                <br />
                <h3 className={styles.title}>& enter eligible voters (separated by commas):</h3>
                { eligibleFields.map((element, index) => (
                    <div>
                        <textarea
                        type="text"
                        // value={title}
                        placeholder= {"Eligible Voter #" + (index+1)}
                        required
                        onChange={(e) => addEligibles(e, index)}
                        className = {styles.input}
                        rows="1"
                        cols="40"
                        />
                        <br />
                        {  index ?
                            <div>
                                <button className = {styles.removeButton} onClick={() => removeEligibleFormFields(index) }>X</button>
                                <br /><br />
                            </div>
                            : null
                        }
                    </div>
                ))}
                <button className = {styles.addButton} onClick={ addEligibleFormFields }>Add</button>
                <br />
                <h3 className={styles.title}>& enter how long poll will last (in minutes):</h3>
                <input
                type="text"
                placeholder="30"
                required
                onChange={(e) => setValidMins(e.target.value)}
                className = {styles.input}
                />
                <br /><br />
                <input type="submit" className= {styles.button}/>
            </form>
        </div>
    );
    }
