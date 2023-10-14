import RPS from "@/abi/RPS";
import Anchor from "@/components/Anchor";
import { ensureMetaMask, getContractInstance } from "@/utilities/helpers";
import { Box, Button, Typography } from "@mui/material";
import { ethers } from "ethers";
import { FC, useState, useEffect, useRef } from "react";

type Player2WaitProps = {
  contractAddress: string | null;
  stake: string | null;
};

const Player2Wait: FC<Player2WaitProps> = ({ contractAddress, stake }) => {
  const [player1resolved, setPlayer1resolved] = useState(false);
  const [player1timeout, setPlayer1timeout] = useState(false);
  const [refunded, setRefunded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkPlayer1 = async () => {
    if (!contractAddress) return;
    if (!ensureMetaMask()) return;

    try {
      const contractInstance = await getContractInstance(contractAddress);

      const currentStake = await contractInstance.stake();
      const lastMove = await contractInstance.lastAction();
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const timeDifference = currentTimeInSeconds - Number(lastMove);
      console.log("currentStake", Number(currentStake));
      console.log("Last Action is", Number(lastMove));
      console.log("Time Difference is", timeDifference);
      if (Number(currentStake) === 0) {
        setPlayer1resolved(true);
        clearInterval(timerRef.current!);
      } else if (timeDifference > 300) {
        setPlayer1timeout(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const refundRequest = async () => {
    if (!contractAddress) return;
    if (!ensureMetaMask()) return;

    try {
      const contractInstance = await getContractInstance(contractAddress, true)
      const response = await contractInstance.j1Timeout({
        value: "0",
        gasLimit: 1500000,
      });
      console.log(response);
      clearInterval(timerRef.current!);
      await response.wait();
      setRefunded(true);
    } catch (error) {
      console.error("Failed to play the game:", error);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      checkPlayer1();
    }, 10000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      {player1resolved ? (
        <>
          <Typography variant="h6">
            The game is Resolved. Please Check your wallet to see if you win or
            lose.
          </Typography>
          <Anchor href="/">
            <Button variant="contained">Go To Homepage</Button>
          </Anchor>
        </>
      ) : player1timeout ? (
        <>
          {refunded ? (
            <>
              <Typography variant="h6">
                2 * {stake} returned to your address as Player 1 timed out
              </Typography>
              <Anchor href="/">
                <Button variant="contained">Go To Homepage</Button>
              </Anchor>
            </>
          ) : (
            <>
              <Typography variant="h6">
                Player 1 timed out. You can either wait or request your funds
                back.
              </Typography>
              <Button onClick={refundRequest} variant="contained">
                Request Funds
              </Button>
            </>
          )}
        </>
      ) : (
        <Typography variant="h6">
          Please Wait for player1 to resolve the game. If he does not in 5
          minutes you can request your funds back.
        </Typography>
      )}
    </Box>
  );
};

export default Player2Wait;
