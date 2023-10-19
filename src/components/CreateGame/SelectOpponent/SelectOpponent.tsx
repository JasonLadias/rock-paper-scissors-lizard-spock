import DisconnectWallet from "@/components/DisconnectWallet";

import { Box, Button, Container, TextField } from "@mui/material";
import { ethers } from "ethers";
import { FC } from "react";

type SelectOpponentProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  opponentAddress: string;
  handleOpponentAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  opponentAddressError: boolean | string;
  setOpponentAddressError: React.Dispatch<
    React.SetStateAction<boolean | string>
  >;
};

const SelectOpponent: FC<SelectOpponentProps> = ({
  setStep,
  opponentAddress,
  handleOpponentAddress,
  opponentAddressError,
  setOpponentAddressError,
}) => {
  const validateInput = () => {
    let error = false;
    if (!opponentAddress) {
      setOpponentAddressError("Please enter an opponent address");
      error = true;
    }
    if (!ethers.isAddress(opponentAddress)) {
      setOpponentAddressError("Please enter a valid address");
      error = true;
    }

    return error;
  };

  const handleNext = () => {
    if (!validateInput()) {
      setStep((step) => step + 1);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <DisconnectWallet />
        <Button variant="contained" onClick={handleNext} disabled={!opponentAddress}>
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default SelectOpponent;
