import { ensureMetaMask } from "@/utilities/helpers";
import { Box, Button, Container, TextField } from "@mui/material";
import { ethers } from "ethers";
import { FC } from "react";

type SelectStakeProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stake: string;
  handleStake: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stakeError: boolean | string;
  setStakeError: React.Dispatch<React.SetStateAction<boolean | string>>;
  address: string | null;
  opponentAddress: string;
};

const SelectStake: FC<SelectStakeProps> = ({
  setStep,
  stake,
  handleStake,
  stakeError,
  setStakeError,
  address,
  opponentAddress,
}) => {
  const validateInput = async () => {
    let error = false;

    if (!stake) {
      setStakeError("Please enter a stake amount");
      error = true;
    }
    const stakeNumber = Number(stake);
    if (stakeNumber < 0.00001) {
      setStakeError("Please enter a stake amount greater than 0.00001");
      error = true;
    }

    if (address && opponentAddress && ensureMetaMask()) {
      const provider = new ethers.BrowserProvider(window.ethereum);

      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);

      if (balanceInEth < stake) {
        setStakeError("You don't have enough balance to stake this amount");
        error = true;
      }

      const opponentBalance = await provider.getBalance(opponentAddress);
      const opponentBalanceInEth = ethers.formatEther(opponentBalance);

      if (opponentBalanceInEth < stake) {
        setStakeError(
          "Your opponent doesn't have enough balance to stake this amount"
        );
        error = true;
      }
    }

    return error;
  };

  const handleNext = async () => {
    const error = await validateInput();
    if (!error) {
      setStep((step) => step + 1);
    }
  };

  const handlePrevious = () => {
    setStep((step) => step - 1);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" onClick={handlePrevious}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={!stake}>
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default SelectStake;
