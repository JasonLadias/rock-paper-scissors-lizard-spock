import {
  Container,
  Button,
  Box,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { FC, useState } from "react";
import { useRouter } from "next/router";
import Anchor from "../Anchor";
import { ethers } from "ethers";
import Head from "next/head";

const HomePage: FC = () => {
  const router = useRouter();
  const [existingContract, setExistingContract] = useState<string>("");
  const [existingContractError, setExistingContractError] = useState<
    boolean | string
  >(false);

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
      return;
    }
    router.push(`/${existingContract}`);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(background.jpg), linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundBlendMode: "darken",
        py: { xs: 4, md: 10 },
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: "80vh",
          bgcolor: "transparent",
        }}
      >
        <Head>
          <title key="title">Rock Paper Scissors Spock Lizard</title>
        </Head>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Typography
            color="white"
            align="center"
            variant="h3"
            sx={{
              textShadow: "3px 3px 3px rgba(0,0,0, 0.5)",
            }}
          >
            Rock Paper Scissors Lizard Spock
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            width: "100%",
            borderRadius: "15px",
            bgcolor: "white",
            boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Anchor href="/create-game">
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                width: "100%",
                fontSize: "1.1rem",
                borderRadius: "12px",
                //boxShadow: "4px 4px 10px #d1d9e6, -4px -4px 10px #ffffff",
                "&:hover": {
                  boxShadow: "2px 2px 5px #d1d9e6, -2px -2px 5px #ffffff",
                },
              }}
            >
              Start New Game
            </Button>
          </Anchor>
          <Divider />
          <Typography variant="h6" textAlign="center" fontWeight={500}>
            Or enter an existing Smart Contract
          </Typography>
          <Box sx={{ p: 1, bgcolor: "white" }}>
            <TextField
              id="outlined-basic"
              label="Enter Smart Contract"
              variant="outlined"
              fullWidth
              value={existingContract}
              onChange={handleExistingContract}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputLabel-root": { fontWeight: 500 },
              }}
              error={!!existingContractError}
              helperText={existingContractError}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!existingContract}
            onClick={handleSubmit}
            sx={{
              width: "100%",
              fontSize: "1.1rem",
              borderRadius: "12px",
              "&:hover": {
                boxShadow: "2px 2px 5px #d1d9e6, -2px -2px 5px #ffffff",
              },
            }}
          >
            Join Existing Game
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
