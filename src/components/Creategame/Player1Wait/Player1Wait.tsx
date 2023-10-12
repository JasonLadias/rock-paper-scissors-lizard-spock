import { ENUMS } from "@/utilities/constants";
import { Box, Typography } from "@mui/material";
import { FC } from "react";

type Player1WaitProps = {
  contractAddress: string | null;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stake: string | null;
  valueSelected: keyof typeof ENUMS | null;
};

const Player1Wait: FC<Player1WaitProps> = ({
  contractAddress,
  setStep,
  stake,
  valueSelected,
}) => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      <Typography variant="h6">
        Contract {contractAddress} is Created
      </Typography>
      <Typography variant="h6">
        You bet {stake} ETH and selected {valueSelected}
      </Typography>
      <Typography variant="h6">
        You wait for the opponent to play
      </Typography>
    </Box>
  );
};

export default Player1Wait;
