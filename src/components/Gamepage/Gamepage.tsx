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
import Player2Deck from "./Player2Deck";
import Player1Deck from "./Player1Deck";
import Anchor from "../Anchor";
import { yellow } from "@mui/material/colors";
import Head from "next/head";

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

  const [stake, setStake] = useState<null | string | -1>(null);

  let contractInstance: ethers.Contract;

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
        setStake(-1);
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
        py: 10,
        display: "flex",
        flexDirection: "column",
        gap: 5,
        alignItems: "center",
      }}
    >
      <Head>
        <title key="title">Rock Paper Scissors Spock Lizard</title>
      </Head>
      <Typography variant="h4" align="center" gutterBottom>
        Game With Contract Address <br /> <span></span>
        {contract}
      </Typography>
      <Box
        sx={{
          p: 3,
          bgcolor: yellow[500],
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          textAlign="left"
          color="primary"
        >
          Note: This game should be played on GOERLI TESTNET
        </Typography>
      </Box>
      {!address && (
        <Button variant="contained" onClick={requestAccount}>
          Connect Wallet
        </Button>
      )}
      {player && player !== -1 && (
        <Typography variant="body1">Welcome Player {player}</Typography>
      )}
      {stake && player !== -1 && (
        <Typography variant="body1">
          {stake === -1 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Typography variant="body1">
                This game has been resolved
              </Typography>
              <Anchor href="/">
                <Button variant="contained">Go To Homepage</Button>
              </Anchor>
            </Box>
          ) : (
            `Stake: ${stake} ETH`
          )}
        </Typography>
      )}
      {player === -1 && (
        <Typography variant="body1" color="error">
          You are not a player in this game
        </Typography>
      )}

      {player === 1 && stake && stake !== -1 && address && (
        <Player1Deck contract={contract} stake={stake} address={address} />
      )}

      {player === 2 && stake && stake !== -1 && address && (
        <Player2Deck contract={contract} stake={stake} address={address} />
      )}
    </Container>
  );
};

export default Gamepage;
