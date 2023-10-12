import { ethers } from 'ethers';

export const hash = (move: number, salt: Uint8Array) => {
    // Combine the values into a single array
    const combined = ethers.defaultAbiCoder.encode(['uint8', 'uint256'], [move, salt]);

    // Compute the keccak256 hash
    return ethers.keccak256(combined);
}
