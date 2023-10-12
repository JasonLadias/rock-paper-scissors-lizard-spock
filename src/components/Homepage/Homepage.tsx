import { Container, Button, Box, TextField, Typography } from "@mui/material";
import { green, grey, yellow } from "@mui/material/colors";
import { FC, useState } from "react";
import { useRouter } from "next/router";
import Anchor from "../Anchor";
import { ethers } from "ethers";

const Homepage: FC = () => {
  const router = useRouter();
  const [existingContract, setExistingContract] = useState<null | string>(null);
  const [existingContractError, setExistingContractError] =
    useState<boolean | string>(false);

  const handleExistingContract = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExistingContract(e.target.value);
    setExistingContractError(false);
  };

  const handleSubmit = async () => {
    if (!existingContract) {
      setExistingContractError("Please Provide a Value");
      return;
    }
    if (!ethers.isAddress(existingContract)) {
      setExistingContractError("Please Provide a valid contract address");
      return;
    }
    const ethereum = window?.ethereum;
    if (!ethereum) {
      setExistingContractError("Please Install Metamask");
      alert("Please install MetaMask");
      return;
    }
    router.push(`/${existingContract}`);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        py: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 5,
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        color="primary"
      >
        Home Page
      </Typography>
      <Box
        sx={{
          p: 3,
          bgcolor: yellow[500],
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          textAlign="left"
          color="primary"
        >
          Note: This game should be played on GOERLI TESTNET
        </Typography>
      </Box>

      <Anchor href="/create-game">
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ width: "100%", fontSize: "1.2rem" }}
        >
          Start New Game
        </Button>
      </Anchor>
      <Box
        sx={{
          p: 3,
          bgcolor: grey[200],
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="subtitle1" textAlign="center" fontWeight="medium">
          OR ENTER PREVIOUS GAME <br /> SMART CONTRACT
        </Typography>

        <TextField
          id="outlined-basic"
          label="Enter Smart Contract"
          variant="outlined"
          fullWidth
          value={existingContract}
          onChange={handleExistingContract}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          error={!!existingContractError}
          helperText={existingContractError}
        />

        <Button
          variant="contained"
          color="secondary"
          size="large"
          disabled={!existingContract}
          onClick={handleSubmit}
          sx={{ width: "100%", fontSize: "1.2rem" }}
        >
          Join Existing Game
        </Button>
      </Box>
    </Container>
  );
};

export default Homepage;
