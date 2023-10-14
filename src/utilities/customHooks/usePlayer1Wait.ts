import { useState, useEffect, useRef } from "react";
import { FIVE_MINUTES, GAS_LIMIT } from "@/utilities/constants";
import { ensureMetaMask, getContractInstance } from "@/utilities/helpers";

type UsePlayer1WaitProps = {
  contractAddress: string | null;
};

/**
 * This hook is used to check the status of Player 1's interactions in the game.
 * - Determines if the game has been resolved by Player 1.
 * - Determines if Player 1 has timed out.
 * - Determines if Player 2 has been refunded.
 * - Allows Player 2 to request a refund if Player 1 has timed out.
 * 
 * @param param0 
 * @returns 
 */
const usePlayer1Wait = ({ contractAddress }: UsePlayer1WaitProps) => {
  const [player1resolved, setPlayer1resolved] = useState(false);
  const [player1timeout, setPlayer1timeout] = useState(false);
  const [refunded, setRefunded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Checks the current status of Player 1's interactions in the game based on the Ethereum contract's state.
   * - Determines if the game has been resolved by Player 1.
   * - Determines if Player 1 has timed out.
   */
  const checkPlayer1 = async () => {
    if (!contractAddress) return;
    if (!ensureMetaMask()) return;

    try {
      const contractInstance = await getContractInstance(contractAddress);

      // Get the last move timestamp and current stake
      const currentStake = await contractInstance.stake();
      const lastMove = await contractInstance.lastAction();
      // Get the current time in seconds
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const timeDifference = currentTimeInSeconds - Number(lastMove);

      // If the current stake is 0, the game is resolved by Player 1
      if (Number(currentStake) === 0) {
        setPlayer1resolved(true);
        clearInterval(timerRef.current!);
      } else if (timeDifference > FIVE_MINUTES) {
        // If the last move was over 5 minutes ago, Player 1 has timed out
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
      const contractInstance = await getContractInstance(contractAddress, true);
      const response = await contractInstance.j1Timeout({
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

  /**
   * Checks the status of Player 1's interactions in the game every 10 seconds.
   */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      checkPlayer1();
    }, 10000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    player1resolved,
    player1timeout,
    refunded,
    refundRequest,
  };
};

export default usePlayer1Wait;
