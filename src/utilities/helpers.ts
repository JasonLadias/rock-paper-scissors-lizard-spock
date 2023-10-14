import RPS from "@/abi/RPS";
import { ethers } from "ethers";

type result = boolean | "Draw";

export const p1wins = (p1move: number, p2move: number): result => {
  // Assuming 0 corresponds to Move.Null in the Solidity version
  if (p1move === p2move || p1move === 0) {
    return "Draw"; // They played the same or did not play, so no winner.
  } else if (p1move % 2 === p2move % 2) {
    return p1move < p2move;
  } else {
    return p1move > p2move;
  }
};

/**
 * This function ensures that MetaMask is installed
 *
 * @returns
 */
export const ensureMetaMask = (): boolean => {
  const ethereum = window?.ethereum;
  if (!ethereum) {
    alert("Please install MetaMask");
    return false;
  }
  return true;
};

/**
 * This function returns a contract instance.
 *
 * @param contractAddress
 * @param useSigner Returns a contract instance with a signer if true
 * @returns
 */
export const getContractInstance = async (
  contractAddress: string,
  useSigner = false
): Promise<ethers.Contract> => {
  const ethereum = window?.ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  let instance;
  if (useSigner) {
    const signer = await provider.getSigner();
    instance = new ethers.Contract(contractAddress, RPS.abi, signer);
  } else {
    instance = new ethers.Contract(contractAddress, RPS.abi, provider);
  }
  return instance;
};
