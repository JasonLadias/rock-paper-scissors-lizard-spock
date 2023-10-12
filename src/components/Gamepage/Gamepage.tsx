import { FC, useEffect, useState } from "react";
import {
  Container,
  Button,
  Box,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { ethers } from "ethers";
import RPS from "@/abi/RPS";
import {
  ENUMS,
  GOERLI_NETWORK,
  J1_STORAGE_POSITION,
  J2_STORAGE_POSITION,
} from "@/utilities/constants";

type GamepageProps = {
  contract: string;
};

declare global {
  interface Window {
    ethereum: any;
  }
}

function extractAddressFromPaddedValue(paddedValue: string): string {
  return "0x" + paddedValue.slice(-40);
}

const Gamepage: FC<GamepageProps> = ({ contract }) => {
  const [address, setAddress] = useState<null | string>(null);
  const [player, setPlayer] = useState<null | -1 | 1 | 2>(null);
  const [valueSelected, setValueSelected] = useState<null | keyof typeof ENUMS>(
    null
  );
  const [stake, setStake] = useState<null | string>(null);

  let contractInstance: ethers.Contract;

  const handleSelectValue = (value: keyof typeof ENUMS) => {
    setValueSelected(value);
  };

  const requestAccount = async () => {
    try {
      const ethereum = window.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId !== GOERLI_NETWORK) {
        alert("Please connect to Goerli Test Network");
        return;
      } else {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      const ethereum = window?.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);

      // Ensure the contract is valid
      const code = await provider.getCode(contract);
      if (code === "0x") {
        alert("The provided address is not a smart contract");
        return;
      }

      const j1ValueFromStorage = await provider.getStorage(
        contract,
        J1_STORAGE_POSITION
      );
      const j2ValueFromStorage = await provider.getStorage(
        contract,
        J2_STORAGE_POSITION
      );

      const j1Value = extractAddressFromPaddedValue(j1ValueFromStorage);
      const j2Value = extractAddressFromPaddedValue(j2ValueFromStorage);

      contractInstance = new ethers.Contract(contract, RPS.abi, provider);
      const stakeValue = await contractInstance.stake();
      console.log(`Stake: ${stakeValue.toString()}`);

      if (!stakeValue) {
        alert("The provided address is not a smart contract");
        return;
      } else {
        setStake(ethers.formatEther(stakeValue));
      }

      // Compare the given address with j1 and j2
      if (address === j1Value) {
        setPlayer(1);
      } else if (address === j2Value) {
        setPlayer(2);
      } else {
        setPlayer(-1);
        alert("You are not a player in this game");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const playGame = async () => {
    if (!valueSelected || !address) {
      alert("Please select a value or connect your wallet first");
      return;
    }

    const move = ENUMS[valueSelected]; // Convert the selected string value to its ENUMS equivalent

    try {
      const ethereum = window?.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contract, RPS.abi, signer);
      const response = await contractInstance.play(move, {
        value: ethers.parseEther(stake || "0"),
      });
      console.log(response)
      await response.wait();
      alert("Successfully made your move!");
    } catch (error) {
      console.error("Failed to play the game:", error);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  useEffect(() => {
    if (address) {
      connectWallet();
    }
  }, [address]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        py: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <h1>GamePage {contract} </h1>
      {address && <p>Wallet Address: {address}</p>}
      {!address && (
        <Button variant="contained" onClick={requestAccount}>
          Connect Wallet
        </Button>
      )}
      {player && player !== -1 && <p>Welcome Player {player}</p>}
      {stake && <p>Stake: {stake} ETH</p>}
      {player === -1 && <p>You are not a player in this game</p>}
      {player && player === 2 && (
        <>
          <Typography variant="h6">Please Select A Value From Below</Typography>
          <Grid
            container
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            {Object.keys(ENUMS).map((keyEnum) => {
              return (
                <Grid
                  key={keyEnum}
                  item
                  xs={2}
                  sx={{ minHeight: "100px", p: 1 }}
                >
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleSelectValue(keyEnum as keyof typeof ENUMS)
                    }
                  >
                    {keyEnum}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
          {valueSelected && (
            <Typography variant="h6">You Selected {valueSelected}</Typography>
          )}
          {valueSelected && (
            <Button variant="contained" onClick={playGame}>
              Play
            </Button>
          )}
        </>
      )}
    </Container>
  );
};

export default Gamepage;
