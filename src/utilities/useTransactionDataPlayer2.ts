import { useState, useEffect } from "react";

/**
 * Custom hook to fetch from localStorage the data of a transaction:
 * - hasMoved: Whether the player has moved or not
 */
const useTransactionDataPlayer2 = (contract: string): boolean => {
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  useEffect(() => {
    const checkMoveStatus = () => {
      const moveStatus = localStorage.getItem(contract);
      setHasMoved(moveStatus === "true");
    };

    checkMoveStatus();
  }, [contract]);

  return hasMoved;
};

export default useTransactionDataPlayer2;
