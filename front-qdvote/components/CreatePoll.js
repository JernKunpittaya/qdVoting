import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { utils } from "web3";
import styles from "./CreatePoll.module.css";

export default function CreatePoll() {
    const [title, setTitle] = useState("");
    const [id, setId] = useState(0);
    const [fields, setFields] = useState([1]); // number of textfields for options
    const [eligibles, setEligibles] = useState([]); // addresses that are eligible to vote
    const [options, setOptions] = useState([{name:"", description:""}]) // options of the current Event
    const { chainId: chainIdHex, web3, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const quadraticVotingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const { runContractFunction: contractCreatePoll } = useWeb3Contract({
        abi: abi,
        contractAddress: quadraticVotingAddress,
        functionName: "createPoll",
        params: {
            _title: "numbers",
            _eligibles: [0x70997970C51812dc3A010C7d01b50e0d17dc79C8],
            _opTitle: ["one", "two"],
        },
    });

    // async function createPoll(e) {
    //     e.preventDefault();
    //     await contractCreatePoll();
    // }

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

    async function createPoll(e) {
        e.preventDefault();
        // ID is auto incrementing
        // setEvents([...Events, { title: title, id: Events.length+1, options: options }]);
        await contractCreatePoll();
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
                <br /><br />
                <input type="submit" className= {styles.button}/>
            </form>
            {/* <CreateItem /> */}
        </div>
    );
    }
