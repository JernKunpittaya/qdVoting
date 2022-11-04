Demo Quadratic Voting 
All logic is from https://learn.figment.io/tutorials/build-a-quadratic-voting-dapp
Stack: hardhat, NextJS(basically React) inspired from https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=63666s&ab_channel=freeCodeCamp.org

Note: This demo only for localhost, not for testnet yet

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
-yarn hardhat deploy —network localhost


Set up frontend
-cd front-qdvote
-yarn
-yarn dev 

btw this error below sometimes come up, but it seems not breaking anything
Ignore Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'itemCount')


Test App
-Import your localhost private key in Metamask, add localhost network and play around


Note
-My code is BAD especially frontend, there is NO consistency since I just try exploring 
many implementations even for the same thing. Comments are just for my debugging stuffs

-I ignore the ipfs and image aspect, ofc then you cannot click claim button since 
I didnt do anything about that

-Still a lot to figure out tgt.
