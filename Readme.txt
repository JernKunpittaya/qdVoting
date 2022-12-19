Demo Quadratic Voting 

Note: This demo only for localhost, not for testnet yet

Smart contract tests:
![11 test cases passed](/testcases_pic.png "11 test cases passed")

Instructions
-Git clone ........

Set up backend
-cd back-qdvote
-yarn
-Crate your .env file [for future sake of testnet + auto link backend abi/contract address to frontend]
.env example
MATIC_RPC_URL = https://rpc-mumbai.maticvigil.com/v1/..........
PRIVATE_KEY = 8.......e [done use real one lol]
UPDATE_FRONT_END=true

Test backend
-yarn hardhat test 

Deploy backend to localhost
-yarn hardhat node [take note of private keys of generated accounts]
-yarn hardhat deploy —-network localhost (make sure to use two dashes)


Set up frontend
-cd front-qdvote
-yarn
-yarn dev 

btw this error below sometimes come up, but it seems not breaking anything
Ignore Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'itemCount')


Test App
-Import your localhost private key in Metamask, add localhost network and play around
-Local host may get confused sometimes, so use setting--> advanced--> reset account for 
your auto-generated address in metamask. [dont mess up your real account.]

References:
Basic logic inspired from: https://learn.figment.io/tutorials/build-a-quadratic-voting-dapp
Development stack is from: Hardhat, NextJS(basically React) inspired from https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=63666s&ab_channel=freeCodeCamp.org