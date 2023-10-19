import {
  Box,
  Button,
  Container,
  TextField,
} from "@mui/material";
import { FC } from "react";

type SelectStakeProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stake: string;
  handleStake: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stakeError: boolean | string;
  setStakeError: React.Dispatch<React.SetStateAction<boolean | string>>;
};

const SelectStake: FC<SelectStakeProps> = ({
  setStep,
  stake,
  handleStake,
  stakeError,
  setStakeError,
}) => {
  const validateInput = () => {
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

    return error;
  };

  const handleNext = async () => {
    if (!validateInput()) {
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
