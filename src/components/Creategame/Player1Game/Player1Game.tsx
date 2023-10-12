import RPS from "@/abi/RPS";
import { ENUMS } from "@/utilities/constants";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { ethers } from "ethers";
import { FC, useState } from "react";

type Player1GameProps = {
  address: string | null;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  opponentAddress: string | null;
  stake: string | null;
  valueSelected: keyof typeof ENUMS | null;
  handleValueSelected: (value: keyof typeof ENUMS) => void;
  handleOpponentAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStake: (e: React.ChangeEvent<HTMLInputElement>) => void;
  valueError: boolean | string;
  opponentAddressError: boolean | string;
  stakeError: boolean | string;
  setValueError: React.Dispatch<React.SetStateAction<boolean | string>>;
  setOpponentAddressError: React.Dispatch<
    React.SetStateAction<boolean | string>
  >;
  setStakeError: React.Dispatch<React.SetStateAction<boolean | string>>;
};

const Player1Game: FC<Player1GameProps> = ({
  address,
  setStep,
  opponentAddress,
  stake,
  valueSelected,
  handleValueSelected,
  handleOpponentAddress,
  handleStake,
  valueError,
  opponentAddressError,
  stakeError,
  setValueError,
  setOpponentAddressError,
  setStakeError,
}) => {

  const validateInput = () => {
    let error = false;
    if (!valueSelected) {
      setValueError("Please select a value");
      error = true;
    }
    if (!opponentAddress) {
      setOpponentAddressError("Please enter an opponent address");
      error = true;
    }
    if (!ethers.isAddress(opponentAddress)) {
      setOpponentAddressError("Please enter a valid address");
      error = true;
    }
    if (!stake) {
      setStakeError("Please enter a stake amount");
      error = true;
    }
    const stakeNumber = Number(stake);
    if (stakeNumber < 0.00001) {
      setStakeError("Please enter a stake amount greater than 0.00001");
      error = true;
    }
    return error;
  }

  const handlePlay = async () => {
    if (!validateInput() && valueSelected) {
      console.log(`
        valueSelected: ${valueSelected}
        opponentAddress: ${opponentAddress}
        stake: ${stake}
      `)

      const randomSalt = ethers.randomBytes(32);

      const hashedMove = ethers.solidityPackedKeccak256(["uint8", "bytes32"], [ENUMS[valueSelected], randomSalt])

      try {
        const ethereum = window?.ethereum;
        if (!ethereum) {
          alert("Please install MetaMask");
          return;
        }
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.ContractFactory(RPS.abi, RPS.bytecode, provider);
        console.log(contractInstance)
        const contract = await contractInstance.deploy({
          args: [hashedMove, opponentAddress],
          gas: "1500000",
          gasPrice: "12000000000",
          value: "100000000000000"
        })
        console.log(contract);
        const deployed = await contract.deploymentTransaction();
        console.log(deployed)
        alert("Successfully made your move!");
      } catch (error) {
        console.error("Failed to play the game:", error);
        alert("Failed to play the game. See the console for more information.");
      }
    }
  }



  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      <Typography variant="h6">Welcome {address} </Typography>
      <Typography variant="h6">Please Select A Value From Below</Typography>
      <Grid
        container
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        {Object.keys(ENUMS).map((keyEnum) => {
          return (
            <Grid
              onClick={() => handleValueSelected(keyEnum as keyof typeof ENUMS)}
              key={keyEnum}
              item
              xs={2}
              sx={{
                minHeight: "100px",
                p: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: keyEnum === valueSelected ? blue[200] : "white",
                border: "1px solid black",
                borderRadius: 2,
                "&:hover": {
                  cursor: "pointer",
                  bgcolor: blue[400],
                },
              }}
            >
              {keyEnum}
            </Grid>
          );
        })}
      </Grid>
      <TextField
        id="outlined-basic"
        label="Enter Opponent Address"
        variant="outlined"
        fullWidth
        value={opponentAddress}
        onChange={handleOpponentAddress}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        error={!!opponentAddressError}
        helperText={opponentAddressError}
      />
      <TextField
        id="outlined-basic"
        label="Enter Stake Amount (ETH)"
        variant="outlined"
        type="number"
        fullWidth
        value={stake}
        onChange={handleStake}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        error={!!stakeError}
        helperText={stakeError}
      />
      {valueSelected && opponentAddress && stake && (
        <Button variant="contained" onClick={handlePlay}>
          Play
        </Button>
      )}
    </Box>
  );
};

export default Player1Game;
