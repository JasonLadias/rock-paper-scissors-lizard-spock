// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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

  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    "0x" + process.env.PRIVATE_KEY1
  );
  web3.eth.accounts.wallet.add(signer);

  const RPSContract = new web3.eth.Contract(ABI);

  // Assuming you have these values from frontend or somewhere
  const player1Move = 1; // just a sample move, replace with actual
  const salt = 123456; // random salt, replace with actual
  const player2Address = "0x1466F66C53a65981328cbc7a66e6705FD39313A2"; 

  const hashedMove = web3.utils.soliditySha3(player1Move, salt);

  const deployTransaction = await RPSContract.deploy({
    data: contractData.bytecode,
    arguments: [hashedMove, player2Address],
  }).send({
    from: "0x23336778983325F523e1537F25CbF9420AF8B518", // replace with the address sending the transaction
    gas: "1500000",
    gasPrice: "12000000000",
    value: web3.utils.toWei("0.0001", "ether"), // sending 1 ether as stake, adjust as needed
  });

  console.log(deployTransaction.options.address);

  res.status(200).json({ smartContractAddress: deployTransaction.options.address });
};

export default handler;
