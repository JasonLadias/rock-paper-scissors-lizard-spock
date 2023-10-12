// Next.js API route for Player 2 to play their move.
// File: pages/api/play-move.ts

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import Web3 from "web3";
import dotenv from "dotenv";

const config = dotenv.config();

const web3 = new Web3(`https://goerli.infura.io/v3/${process.env.INFURA_KEY}`);

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Get the ABI from the JSON file
    const dirPath = path.resolve(process.cwd());
    const rawData = fs.readFileSync(path.join(dirPath, "RPS.json"), "utf8");

    const contractData = JSON.parse(rawData);
    const ABI = contractData.abi;

    // Create a signing account for Player 2 from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(
        "0x" + process.env.PRIVATE_KEY2  // Make sure you've a PRIVATE_KEY2 set up for Player 2
    );
    web3.eth.accounts.wallet.add(signer);

    // Use the provided contract address to create a new contract instance
    const contractAddress = req.body.contractAddress;  // Get this from the request
    console.log(contractAddress)
    const RPSContract = new web3.eth.Contract(ABI, contractAddress);
    console.log(RPSContract)

    // Assuming you get Player 2's move from the request or frontend
    const player2Move = 2;  // Assuming you'll send the move as a part of the request.

    const playTransaction = await RPSContract.methods.play(player2Move).send({
        from: signer.address,
        gas: "1500000",
        gasPrice: "12000000000",
        value: web3.utils.toWei("0.0001", "ether"), // sending 1 ether as stake, adjust as needed
    });

    console.log(playTransaction);

    res.status(200).json({ transactionHash: playTransaction });
};

export default handler;
