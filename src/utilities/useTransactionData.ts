import { useState, useEffect } from "react";
import { ENUMS } from "./constants";

const convertToObjectUint8Array = (obj: Record<string, number>): Uint8Array => {
  const values = Object.values(obj).map((val) => Number(val));
  return new Uint8Array(values);
};

type TransactionData = {
  randomSalt: Uint8Array | null;
  hashedMove: string | null;
  valueSelected: keyof typeof ENUMS | null;
};

// Custom Hook to fetch data from localStorage based on a transaction hash
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
