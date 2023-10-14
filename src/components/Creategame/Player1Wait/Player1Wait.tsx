import Anchor from "@/components/Anchor";
import {
  ENUMS,
  FIVE_MINUTES,
  GAS_LIMIT,
  REVERSE_ENUMS,
} from "@/utilities/constants";
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
  stake: string;
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

  /**
   * Checks the current status of Player 2's interactions in the game based on the Ethereum contract's state.
   * - Determines if the game has been resolved by Player 2.
   * - Updates the game state if Player 2 has made a move.
   * - Sets a timeout if Player 2 hasn't acted in over five minutes.
   */
  const checkPlayer2 = async () => {
    if (!contractAddress) return;
    if (!ensureMetaMask()) return;
    try {
      const contractInstance = await getContractInstance(contractAddress);
      // Get the player 2 move, last move timestamp, and current stake
      const player2Move = await contractInstance.c2();
      const lastMove = await contractInstance.lastAction();
      const currentStake = await contractInstance.stake();
      // Get the current time in seconds
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const timeDifference = currentTimeInSeconds - Number(lastMove);

      // If the current stake is 0, the game is resolved by Player 2
      if (Number(currentStake) === 0) {
        setGameResolved(true);
        clearInterval(timerRef.current!);
      } else {
        // If the player 2 move is not 0, set the move and set player 2 played to true
        if (Number(player2Move) !== 0) {
          setPlayer2move(Number(player2Move) as 0 | 1 | 2 | 3 | 4 | 5);
          setPlayer2played(true);
        } else if (timeDifference > FIVE_MINUTES) {
          // If the time difference is greater than 5 minutes, set player 2 timeout to true
          setPlayer2timeout(true);
        }
      }
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
        gasLimit: GAS_LIMIT,
      });
      clearInterval(timerRef.current!);
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

      // Convert the salt to a BigInt
      const saltUint256 = ethers.toBigInt(salt);

      // Call the solve function with the selected value and salt as parameters
      const response = await contractInstance.solve(
        ENUMS[valueSelected],
        saltUint256
      );
      clearInterval(timerRef.current!);
      await response.wait();
      setResolved(true);
    } catch (error) {
      console.error("Failed to play the game:", error);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  /**
   * This hook sets a timer to check if Player 2 has played.
   */
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
            - You bet {stake} ETH and selected {valueSelected}
          </Typography>
          <Typography variant="h6">
            - You are waiting for Player 2 to play.
          </Typography>
          <Typography variant="h6">
            - Give your opponent the following link{" "}
            <span
              style={{ fontWeight: 500, background: "lightgrey", padding: 10 }}
            >
              {window.location.host}/{contractAddress}
            </span>{" "}
            and wait for them to play.
          </Typography>
          <Typography variant="h6">
            - If they do not play in 5 minutes you can request a refund
          </Typography>
        </>
      )}
    </Box>
  );
};

export default Player1Wait;
