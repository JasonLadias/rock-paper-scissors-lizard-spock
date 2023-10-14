import { useState, useEffect, useRef } from "react";
import {
  ensureMetaMask,
  getContractInstance,
} from "@/utilities/helpers";
import { ENUMS, FIVE_MINUTES, GAS_LIMIT } from "@/utilities/constants";
import { ethers } from "ethers";

type usePlayer2WaitProps = {
  contractAddress: string | null;
  valueSelected: keyof typeof ENUMS | null;
  salt: Uint8Array | null;
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
export const usePlayer2Wait = ({ contractAddress, valueSelected, salt }: usePlayer2WaitProps) => {
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
    if (!contractAddress || !salt || !valueSelected) return;
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
    player2played,
    player2timeout,
    refunded,
    resolved,
    gameResolved,
    player2move,
    finishGame,
    refundRequest,
  };
};
