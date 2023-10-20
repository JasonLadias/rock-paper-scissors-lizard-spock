import { FC, useEffect, useState } from "react";
import { Container, Button, Box, Typography } from "@mui/material";
import { ethers } from "ethers";
import {
  J1_STORAGE_POSITION,
  J2_STORAGE_POSITION,
} from "@/utilities/constants";
import Player2Deck from "../GameDecks/Player2Deck";
import Anchor from "../Anchor";
import { yellow } from "@mui/material/colors";
import Head from "next/head";
import { ensureMetaMask, getContractInstance } from "@/utilities/helpers";
import { useAppSelector } from "@/utilities/customHooks/storeHooks";
import ConnectWallet from "../ConnectWallet";
import DisconnectWallet from "../DisconnectWallet";
import Player1Deck from "../GameDecks/Player1Deck";

type GamePageProps = {
  contract: string;
};

declare global {
  interface Window {
    ethereum: any;
  }
}

// Extract the address from the padded value
function extractAddressFromPaddedValue(paddedValue: string): string {
  return "0x" + paddedValue.slice(-40);
}

const GamePage: FC<GamePageProps> = ({ contract }) => {
  const { address } = useAppSelector((state) => state.wallet);
  // -1 means not a player, 1 means player 1, 2 means player 2 and null means not yet determined
  const [player, setPlayer] = useState<null | -1 | 1 | 2>(null);
  // -1 means game has been resolved, null means not yet determined
  const [stake, setStake] = useState<null | string | -1>(null);

  let contractInstance: ethers.Contract;

  /**
   * This function connects to the contract and checks:
   * - If the contract is valid
   * - If the user is a player in the game
   * - The current stake of the game
   *   - If the stake is 0, the game has been resolved
   *   - If the stake is not 0, the game is still ongoing
   */
  const connectWallet = async () => {
    if (!ensureMetaMask()) return;
    try {
      const ethereum = window?.ethereum;

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

      contractInstance = await getContractInstance(contract);

      const stakeValue = await contractInstance.stake();

      // If the stake is 0, the game has been resolved
      if (!stakeValue) {
        setStake(-1);
        return;
      } else {
        setStake(ethers.formatEther(stakeValue));
      }

      // Compare the given address with j1 and j2
      if (address === j1Value) {
        // If the address is j1, set player to 1
        setPlayer(1);
      } else if (address === j2Value) {
        // If the address is j2, set player to 2
        setPlayer(2);
      } else {
        // If the address is neither j1 nor j2, set player to -1(not a player)
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
      {address ? <DisconnectWallet /> : <ConnectWallet />}
      {stake === -1 && (
        <Typography variant="body1">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="body1">This game has been resolved</Typography>
            <Anchor href="/">
              <Button variant="contained">Go To Homepage</Button>
            </Anchor>
          </Box>
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

export default GamePage;
