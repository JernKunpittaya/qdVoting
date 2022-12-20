# Quadratic Voting Application

Teammates: Jern Kunpitaya (tk2862@columbia.edu), Forest Shi (fs2751@columbia.edu), Tasha Pais (tdp2129@columbia.edu)

Deployment link: https://quadratic-voting-lyart.vercel.app/ <br>

[Pitch deck](https://drive.google.com/file/d/1LU-ehyBrtnmpiXlgzYoBJ8swEkatdVtM/view?usp=share_link)

Smart contract tests:
![My Image](testcases_pic.png)

## Instructions to run locally (for development):

1. `git clone https://github.com/JernKunpittaya/qdVoting.git` <br>
2. Setup backend <br>
   `cd back-qdvote` <br>
   `yarn` <br>
   create .env file with the text below for future sake of testnet + auto link backend abi/contract address to frontend: <br>
   MATIC_RPC_URL = https://rpc-mumbai.maticvigil.com/v1/1c3ac566f4a286bfb47da26b301c733b7d2f1868 <br>
   PRIVATE_KEY = [from Metamask account] <br>
   UPDATE_FRONT_END=true! <br>
3. Test backend <br>
   `yarn hardhat test` <br>
4. Deploy backend to localhost <br>
   `yarn hardhat node` [take note of private keys of generated accounts] <br>
   `yarn hardhat deploy —-network localhost` [make sure to use two dashes] <br>
5. Setup frontend <br>
   `cd front-qdvote` <br>
   `yarn` <br>
   `yarn dev` <br>
6. Import your localhost private key in Metamask, add localhost network and play around. Local host may get confused sometimes, so use setting--> advanced--> reset account for your auto-generated address in metamask. [dont mess up your real account]

## References:

Basic logic inspired from [Figment](https://learn.figment.io/tutorials/build-a-quadratic-voting-dapp) <br>
Development stack is Hardhat+ Next.js from this [video](https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=63666s&ab_channel=freeCodeCamp.org)

## Security Design

Here are security design we've covered for this voting platform to be rigid.

1. Make sure people cannot vote after the poll time expires, this is to prevent people from changing the record of the result. We explicitly specify "require" statement in contract to enforce this to vote function in Poll contract <br>
2. Make sure anyone can publish the result after the poll time expires. We don't grant an authority to certain people to publish the result since that can lead to centralized fraud. Hence, any wallet address, once the time of the poll is up, can click to publish the result of that poll. (Note that time became tricky when we deploy localhost since no block is mined if there is no transaction, so we included dummy transaction in the publishResult method to make sure time proceed everytime on blockchain when someone tries to publish the result. This became trivial once we deploy to Matic Testnet since there are many transactions all the time. <br>
3. On the other hand, no-one can publish or get the winning result of the poll before the time expires. Although they can see the current vote on each option, they cannot trick the contract to store that as winning option since we specify require statement to only be able to publish result once time is up. This is to prevent people from just publishing result once they see their preferred option is winning. <br>
4. We make sure that only the eligible people in a certain poll can vote in that poll. However, we can see that calling the vote function in Poll contract allows for possible exploit since an attacker can just pass argument as an address of eligible voter to vote, despite they are not eligible themselves. We prevent this exploit by requiring the caller of vote function in Poll.sol are only from our Factory.sol. And in our Factory.sol, the only function that interact with Poll.sol is taking the msg.sender and pass as argument to the vote function in Poll.sol, making sure that Factory only passes argument as the address of the caller. Hence, only eligible voter can vote in that poll! <br>

## What pain point are we addressing?

There are a lot of limitations to the traditional one-person-one-vote model of collective decision making. Minorities with strong interests may be drowned out by the sea of majority voices and things like the "free-rider problem" pop up with the use of public goods. We need a new way of voting and collective decision making that not only represents how you feel about an issue, but also how strongly you feel about it-- giving minorities with strong individual preferences the ability to make a stronger vote than someone who doesn't care as much about the issue. We need to have everyone's voices heard while keeping voting secure and anonymous. Now that blockchain-enabled collective decision making allows votes to be tracked in a transparent, public way, more complicated voting systems can be adopted. By allowing voters to express not just their preferences but also the intensity of these preferences, quadratic voting protects the interests of small groups of voters that care deeply about certain issues and can provide some solutions to security, anonymity, and collusion.

## How are we addressing this?

Quadratic voting is a collective decision-making procedure which involves individuals allocating votes to express the degree of their preferences, rather than just the direction of their preferences. By doing so, quadratic voting seeks to address issues of the Condorcet paradox and majority rule. Quadratic voting works by allowing users to "pay" for additional votes on a given matter to express their support for given issues more strongly, resulting in voting outcomes that are aligned with the highest willingness to pay outcome, rather than just the outcome preferred by the majority regardless of the intensity of individual preferences. We want to popularize this logic and make it accessible for everyone, hence making it web3 product that is transparent, uncensorable and modular enough so people can build any other voting algorithm upon it.

## Why is this the best solution for the problem?

The payment for votes may be through either artificial or real currencies (e.g. with tokens distributed equally among voting members or with real money). Quadratic voting is a variant of cumulative voting. It differs from cumulative voting by altering "the cost" and "the vote" relation from linear to quadratic. By doing so, quadratic voting better protects the interests of small groups of voters that care deeply about particular issues. By increasing the cost of each additional vote, it disincentivizes voters that don’t care about issues from casting several votes for them. It also allows voters to show the intensity of their support for a given issue by casting several votes for it — at the expense of their ability to vote on other issues. And the reason why web3 is crucial is already described in previous question.

## Why is our project different than existing solutions?

The are already some quadratic voting and quadratic funding platforms out there that allow votes to be cast for public goods and provide crowd funding for projects. There are currently no consumer facing applications that democratically pool money for group decision-making. We are focusing on a more everyday consumer focused approach to the problem. We want to design a mobile or app web that will allow any group to post issues or decisions that they want to make and let others in their group to be able to vote on them, with the option to pool money or not. Issues can be as low-stakes as a group voting on where they should take a trip, which Airbnb to stay in, or where to have dinner to more seriouses issues like large organizations and institutions such as companies or uiversities making decisions on where to spend their money or what project to proceed with next. We also want to introduce the option of anonymous voting to protect the identities of the voters and to prevent malicious actions during the voting process.

## How do you prevent voters from using multiple accounts?

If the group is of a limited size and everyone knows the members of the group, this will not be an issue. For large groups, where members of not known, one possible solution is to have the creator of the group send out invites to join the group via special "nonce" that only those who are allowed to join can join. Another possible solution is to collaborate with a proof of history like BrightID, or can have a trait that cannot be just multiplied like holding a certain NFT.

## (For prof.) We use this deliverable as our new proposal too! And here's why it's different from the proposal we handed in mid-semester.

Our first proposal is to create an anonymous social graph, somewhat like FB but not allowing your connection to be publicly known. However, we later see that this is overkilled and the anonymous social graph doesn't provide strong value. So, we scoped down, but still adhered to the same passion to build thing that is good for people interacting with each other which resonates with the decentralized mission of blockchain. Then, we study quadratic voting that is claimed to be fairer than normal linear voting for decision making and public resource allocation. However, the existing use-cases of quadratic voting in reality is mostly quadratic funding like Gitcoin, not quadratic voting. We want to create a platform that allows people to create any poll that can be voted by quadratic voting, which can be applied for use in DAO or even NFT holder. For now, we need to manually input who is eligible to vote in each poll, but we can extend it a lot more, like having option to include everyone holding a certain set of NFT as being eligible to vote for that poll for example. We also believe this web3 project can be extended to make it applicable to any algorithm even besides linear and quadratic voting in the future. Web3 makes this project transparent, un-censorable and modular for people to help build upon :)
