import { GOERLI_NETWORK } from "@/utilities/constants";
import { ensureMetaMask } from "@/utilities/helpers";
import { Button } from "@mui/material";
import { FC } from "react";

type ConnectWalletProps = {
  setAddress: (address: string) => void;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ConnectWallet: FC<ConnectWalletProps> = ({ setAddress, setStep }) => {
  const requestAccount = async () => {
    if (!ensureMetaMask()) return;
    try {
      const ethereum = window.ethereum;

      let chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId !== GOERLI_NETWORK) {
        alert("Please connect to Goerli Test Network");
        return;
      } else {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
        setStep((prev) => prev + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button variant="contained" onClick={requestAccount}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWallet;
