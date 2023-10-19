import { useState, useEffect } from "react";
import { ENUMS } from "../constants";
import { convertToObjectUint8Array } from "../helpers";



type TransactionData = {
  randomSalt: Uint8Array | null;
  hashedMove: string | null;
  valueSelected: keyof typeof ENUMS | null;
};

/**
 * Custom hook to fetch from localStorage the data of a transaction:
 * - randomSalt: The random salt used to generate the hashed move
 * - hashedMove: The hashed move
 * - valueSelected: The move selected by the player
 */
const useTransactionData = (transactionHash: string) => {
  const [data, setData] = useState<TransactionData>({
    randomSalt: null,
    hashedMove: null,
    valueSelected: null,
  });

  useEffect(() => {
    const fetchData = () => {
      const storedData = localStorage.getItem(transactionHash);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (
          parsedData &&
          parsedData.randomSalt &&
          parsedData.hashedMove &&
          parsedData.valueSelected
        ) {
          setData({
            randomSalt: convertToObjectUint8Array(parsedData.randomSalt),
            hashedMove: parsedData.hashedMove,
            valueSelected: parsedData.valueSelected,
          });
        }
      }
    };

    fetchData();
  }, [transactionHash]);

  return data;
};

export default useTransactionData;
