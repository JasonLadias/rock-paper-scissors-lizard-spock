import RPS from "@/abi/RPS";
import { ENUMS, GAS_LIMIT } from "@/utilities/constants";
import { ensureMetaMask } from "@/utilities/helpers";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { ethers } from "ethers";
import { FC, useState } from "react";

type Player1GameProps = {
  address: string | null;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  opponentAddress: string;
  stake: string;
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
  setSalt: React.Dispatch<React.SetStateAction<Uint8Array | null>>;
  setContractAddress: React.Dispatch<React.SetStateAction<string | null>>;
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
  setSalt,
  setContractAddress,
}) => {
  const [loading, setLoading] = useState(false);
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
  };

  /**
   * The `handlePlay` function is responsible for initiating a game move.
   * It first validates the input and prepares a move by hashing the selected value along with a random salt.
   * It then interacts with the Ethereum blockchain to deploy a contract for the game move.
   * If successful, it stores necessary game data into the local storage.
   */
  const handlePlay = async () => {
    if (!validateInput() && valueSelected) {
      // Generate a random salt using ethers.
      const randomSalt = ethers.randomBytes(32);
      // Hash the selected move with the random salt to produce a hashed move.
      const hashedMove = ethers.solidityPackedKeccak256(
        ["uint8", "bytes32"],
        [ENUMS[valueSelected], randomSalt]
      );
      if (!ensureMetaMask()) return;

      try {
        const ethereum = window?.ethereum;

        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        // Create a new contract instance with the ABI, bytecode, and signer.
        const contractInstance = new ethers.ContractFactory(
          RPS.abi,
          RPS.bytecode,
          signer
        );

        // Deploy the new contract with the hashed move, opponent's address, and other necessary parameters.
        const contract = await contractInstance.deploy(
          hashedMove,
          opponentAddress,
          {
            from: address,
            value: ethers.parseUnits(stake, "ether"),
            gasLimit: GAS_LIMIT,
          }
        );
        const contractAddress = await contract.getAddress();
        setLoading(true);
        await contract.deploymentTransaction()?.wait();

        // Set the necessary game data.
        setSalt(randomSalt);
        setContractAddress(contractAddress);
        setStep((prev) => prev + 1);
        setLoading(false);
        const object = {
          randomSalt,
          hashedMove,
          valueSelected,
        };
        // Stores data in local storage in case of page refresh
        localStorage.setItem(contractAddress, JSON.stringify(object));
      } catch (error) {
        setLoading(false);
        console.error("Failed to play the game:", error);
        alert("Failed to play the game. See the console for more information.");
      }
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {loading ? (
        <>
          {" "}
          <Typography variant="h6">Welcome {address} </Typography>
          <Typography variant="h6">
            Your Transaction is being transmitted please wait.
          </Typography>
        </>
      ) : (
        <>
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
                  onClick={() =>
                    handleValueSelected(keyEnum as keyof typeof ENUMS)
                  }
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
        </>
      )}
    </Box>
  );
};

export default Player1Game;
