import { ethers } from 'ethers';

export const hash = (move: number, salt: Uint8Array) => {
    // Combine the values into a single array
    const combined = ethers.defaultAbiCoder.encode(['uint8', 'uint256'], [move, salt]);

    // Compute the keccak256 hash
    return ethers.keccak256(combined);
}



type result = boolean | "Draw";

export const p1wins = (p1move: number, p2move: number): result => {
    // Assuming 0 corresponds to Move.Null in the Solidity version
    if (p1move === p2move || p1move === 0) {
        return "Draw";  // They played the same or did not play, so no winner.
    } else if (p1move % 2 === p2move % 2) {
        return p1move < p2move;
    } else {
        return p1move > p2move;
    }
}


