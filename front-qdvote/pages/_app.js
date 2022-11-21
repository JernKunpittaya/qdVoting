import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Layout from "../components/Layout";
// import { MoralisProvider } from "react-moralis";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
const { ethers } = require("ethers");
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
const infuraId = "1df3b430a5f740cc9b22b8564a15096a";
// const { chains, provider } = configureChains(
//   [chain.polygonMumbai, chain.hardhat],
//   [
//     infuraProvider({ infuraId }),
//     jsonRpcProvider({
//       rpc: (chain) => ({
//         http: `https://${chain.id}.127.0.0.1:8545/`,
//       }),
//     }),
//   ]
// );

const ethProvider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:8545/",
  ethers.providers.getNetwork(31337)
);
// const connector = new MetaMaskConnector({ chains: [chain.hardhat] });

// const connectors = connectorsForWallets([
//   {
//     groupName: "Recommended",
//     wallets: [metaMaskWallet({ chains: [chain.hardhat] })],
//   },
// ]);

const { connectors } = getDefaultWallets({
  appName: "Quadratic Voting",
  chains: [chain.hardhat],
});
const wagmiClient = createClient({
  autoConnect: true,
  provider: ethProvider,
  connectors,
});
// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });
function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={[chain.hardhat]}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
