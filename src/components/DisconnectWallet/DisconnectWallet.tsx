import { useAppDispatch } from "@/utilities/customHooks/storeHooks";
import { disconnectWallet } from "@/utilities/store/walletSlice";
import { Button } from "@mui/material";
import { FC } from "react";

const DisconnectWallet: FC = () => {
  const dispatch = useAppDispatch();

  const disconnectAccount = async () => {
    dispatch(disconnectWallet());
  };

  return (
    <Button variant="contained" onClick={disconnectAccount}>
      Disconnect Wallet
    </Button>
  );
};

export default DisconnectWallet;
