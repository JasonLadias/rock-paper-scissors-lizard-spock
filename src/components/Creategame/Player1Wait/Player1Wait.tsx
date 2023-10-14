import Anchor from "@/components/Anchor";
import { ENUMS, REVERSE_ENUMS } from "@/utilities/constants";
import {
  ensureMetaMask,
  getContractInstance,
  p1wins,
} from "@/utilities/helpers";
import { Box, Button, Typography } from "@mui/material";
import { ethers } from "ethers";
import { FC, useState, useEffect, useRef } from "react";

type Player1WaitProps = {
  contractAddress: string | null;
  stake: string | null;
  valueSelected: keyof typeof ENUMS | null;
  salt: Uint8Array | null;
};

const Player1Wait: FC<Player1WaitProps> = ({
  contractAddress,
  stake,
  valueSelected,
  salt,
}) => {
  const [player2played, setPlayer2played] = useState(false);
  const [player2timeout, setPlayer2timeout] = useState(false);
  const [gameResolved, setGameResolved] = useState(false);
  const [refunded, setRefunded] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [player2move, setPlayer2move] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkPlayer2 = async () => {
    if (!contractAddress) return;
    if (!ensureMetaMask()) return;
    try {
      const contractInstance = await getContractInstance(contractAddress);
      const player2Move = await contractInstance.c2();
      const lastMove = await contractInstance.lastAction();
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const currentStake = await contractInstance.stake();
      const timeDifference = currentTimeInSeconds - Number(lastMove);
      console.log("Player 2 Move is", Number(player2Move));
      console.log("Last Action is", Number(lastMove));
      console.log("Time Difference is", timeDifference);
      if (Number(currentStake) === 0) {
        setGameResolved(true);
        clearInterval(timerRef.current!);
      } else {
        if (Number(player2Move) !== 0) {
          setPlayer2move(Number(player2Move) as 0 | 1 | 2 | 3 | 4 | 5);
          setPlayer2played(true);
        } else if (timeDifference > 300) {
          setPlayer2timeout(true);
        }
      }

      console.log(currentStake);
    } catch (err) {
      console.log(err);
    }
  };

  const refundRequest = async () => {
    if (!contractAddress) return;
    if (!ensureMetaMask()) return;
    try {
      const contractInstance = await getContractInstance(contractAddress, true);

      const response = await contractInstance.j2Timeout({
        value: "0",
        gasLimit: 1500000,
      });
      clearInterval(timerRef.current!);
      console.log(response);
      await response.wait();
      setRefunded(true);
    } catch (error) {
      console.error("Failed to play the game:", error);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  const finishGame = async () => {
    if (!contractAddress || !valueSelected || !salt) return;
    if (!ensureMetaMask()) return;
    try {
      const contractInstance = await getContractInstance(contractAddress, true);

      const saltUint256 = ethers.toBigInt(salt);

      const response = await contractInstance.solve(
        ENUMS[valueSelected],
        saltUint256
      );
      console.log(response);
      clearInterval(timerRef.current!);
      await response.wait();
      setResolved(true);
    } catch (error) {
      console.error("Failed to play the game:", error);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      checkPlayer2();
    }, 10000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {gameResolved ? (
        <>
          <Typography variant="h6">
            You timed out. Player 2 won the game.
          </Typography>
          <Anchor href="/">
            <Button variant="contained">Go To Homepage</Button>
          </Anchor>
        </>
      ) : player2played ? (
        <>
          {resolved ? (
            <>
              <Typography variant="h6">The game is Resolved</Typography>
              {valueSelected && (
                <Typography variant="h6">
                  {p1wins(ENUMS[valueSelected], player2move) === "Draw"
                    ? "Draw"
                    : p1wins(ENUMS[valueSelected], player2move)
                    ? "You Won"
                    : "You Lost"}
                </Typography>
              )}
              <Anchor href="/">
                <Button variant="contained">Go To Homepage</Button>
              </Anchor>
            </>
          ) : (
            <>
              <Typography variant="h6">
                Player 2 played {REVERSE_ENUMS[player2move]} and you{" "}
                {valueSelected}
              </Typography>
              {valueSelected && (
                <Typography variant="h6">
                  {p1wins(ENUMS[valueSelected], player2move) === "Draw"
                    ? "Draw"
                    : p1wins(ENUMS[valueSelected], player2move)
                    ? "You Won"
                    : "You Lost"}
                </Typography>
              )}
              <Button onClick={finishGame} variant="contained">
                Resolve Game
              </Button>
            </>
          )}
        </>
      ) : player2timeout ? (
        <>
          {refunded ? (
            <>
              <Typography variant="h6">
                {stake} returned to your address as Player 2 timed out
              </Typography>
              <Anchor href="/">
                <Button variant="contained">Go To Homepage</Button>
              </Anchor>
            </>
          ) : (
            <>
              <Typography variant="h6">
                Player 2 timed out. You can either wait or request your funds
                back.
              </Typography>
              <Button onClick={refundRequest} variant="contained">
                Request Funds
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <Typography variant="h6">
            Contract {contractAddress} is Created
          </Typography>
          <Typography variant="h6">
            You bet {stake} ETH and selected {valueSelected}
          </Typography>
          <Typography variant="h6">
            Give them the following link{" "}
            <span
              style={{ fontWeight: 500, background: "lightgrey", padding: 10 }}
            >
              {window.location.host}/{contractAddress}
            </span>{" "}
            and wait for them to play.
          </Typography>
        </>
      )}
    </Box>
  );
};

export default Player1Wait;
