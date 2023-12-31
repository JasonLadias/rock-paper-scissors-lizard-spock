import { useState, useEffect, useRef } from "react";
import {
  convertToObjectUint8Array,
  ensureMetaMask,
  getContractInstance,
} from "@/utilities/helpers";
import { ENUMS, FIVE_MINUTES, GAS_LIMIT } from "@/utilities/constants";
import { ethers } from "ethers";
import { OpponentPlayer2State, Player1State } from "../types";
import { set } from "rambdax";

type usePlayer2WaitProps = {
  contractAddress: string | null;
  valueSelected: keyof typeof ENUMS | null;
  salt: Record<string, number> | null;
};

/**
 * This hook is used to check the status of Player 2's interactions in the game.
 * - Determines if the game has been resolved by Player 2.
 * - Updates the game state if Player 2 has made a move.
 * - Sets a timeout if Player 2 hasn't acted in over five minutes.
 *
 * @param param0
 * @returns
 */
export const usePlayer2Wait = ({
  contractAddress,
  valueSelected,
  salt,
}: usePlayer2WaitProps) => {
  const [player2State, setPlayer2State] =
    useState<OpponentPlayer2State>("waiting");
  const [player1State, setPlayer1State] = useState<Player1State>("waiting");
  const [player2move, setPlayer2move] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [loading, setLoading] = useState(false);
  const [latestMove, setLatestMove] = useState(0);
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

      if (Number(lastMove) > latestMove) {
        setLatestMove(Number(lastMove));
      }

      // If the current stake is 0, the game is resolved by Player 2
      if (Number(currentStake) === 0) {
        setPlayer2State("refunded");
        clearInterval(timerRef.current!);
      } else {
        // If the player 2 move is not 0, set the move and set player 2 played to true
        if (Number(player2Move) !== 0) {
          setPlayer2move(Number(player2Move) as 0 | 1 | 2 | 3 | 4 | 5);
          setPlayer2State("moveSelected");
        } else if (timeDifference > FIVE_MINUTES) {
          // If the time difference is greater than 5 minutes, set player 2 timeout to true
          setPlayer2State("timedOut");
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
      setLoading(true);
      const response = await contractInstance.j2Timeout({
        gasLimit: GAS_LIMIT,
      });
      clearInterval(timerRef.current!);
      await response.wait();
      setLoading(false);
      setPlayer1State("refunded");
    } catch (error) {
      setLoading(false);
      console.error("Failed to play the game:", error);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  const finishGame = async () => {
    console.log(contractAddress)
    console.log(salt)
    console.log(valueSelected)
    if (!contractAddress || !salt || !valueSelected) return;
    console.log(2)
    if (!ensureMetaMask()) return;
    console.log(3)
    try {
      const contractInstance = await getContractInstance(contractAddress, true);
      console.log(4)
      // Convert the salt to a BigInt
      const saltUint256 = ethers.toBigInt(convertToObjectUint8Array(salt));
      setLoading(true);

      // Call the solve function with the selected value and salt as parameters
      const response = await contractInstance.solve(
        ENUMS[valueSelected],
        saltUint256
      );
      console.log(5)
      clearInterval(timerRef.current!);
      await response.wait();
      console.log(6)
      setLoading(false);

      setPlayer1State("resolved");
    } catch (error) {
      setLoading(false);
      console.error("Failed to play the game:", error);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  /**
   * Checks the status of Player 2's interactions in the game every 10 seconds.
   */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      checkPlayer2();
    }, 10000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    player2State,
    player1State,
    player2move,
    latestMove,
    loading,
    finishGame,
    refundRequest,
  };
};

export default usePlayer2Wait;
