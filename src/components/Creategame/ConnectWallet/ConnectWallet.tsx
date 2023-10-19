import { GOERLI_NETWORK } from "@/utilities/constants";
import { useAppDispatch } from "@/utilities/customHooks/storeHooks";
import { ensureMetaMask } from "@/utilities/helpers";
import { connectWallet } from "@/utilities/store/walletSlice";
import { Button } from "@mui/material";
import { FC } from "react";

type ConnectWalletProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ConnectWallet: FC<ConnectWalletProps> = ({ setStep }) => {
  const dispatch = useAppDispatch();

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
        dispatch(connectWallet(accounts[0]));
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
