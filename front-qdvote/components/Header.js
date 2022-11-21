// import { ConnectButton } from "web3uikit";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <div className="relative h-32 w-32 ...">
      <div className="absolute left-75 top-0 h-16 w-16 ...">
        <ConnectButton className="bg-white"></ConnectButton>
      </div>
    </div>
  );
}
