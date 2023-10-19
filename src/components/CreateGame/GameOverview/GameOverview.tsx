import RPS from "@/abi/RPS";
import { ENUMS, GAS_LIMIT } from "@/utilities/constants";
import { useAppDispatch } from "@/utilities/customHooks/storeHooks";
import useGame from "@/utilities/customHooks/useGame";
import { ensureMetaMask } from "@/utilities/helpers";
import { player1AddNewGame } from "@/utilities/store/gameSlice";
import { Player1StoredMove } from "@/utilities/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import CasinoIcon from "@mui/icons-material/Casino";
import { blue } from "@mui/material/colors";

import { ethers } from "ethers";
import { FC, useState } from "react";
import { useRouter } from "next/router";

type GameOverviewProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  address: string | null;
  opponentAddress: string;
  stake: string;
  valueSelected: keyof typeof ENUMS | null;
};

const GameOverview: FC<GameOverviewProps> = ({
  setStep,
  address,
  opponentAddress,
  stake,
  valueSelected,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to handle error messages

  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const game = useGame({ contractAddress });
  const dispatch = useAppDispatch();
  const router = useRouter();

  /**
   * The `handlePlay` function is responsible for initiating a game move.
   * It first validates the input and prepares a move by hashing the selected value along with a random salt.
   * It then interacts with the Ethereum blockchain to deploy a contract for the game move.
   * If successful, it stores necessary game data into the local storage.
   */
  const handlePlay = async () => {
    if (valueSelected) {
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
        const contractAddr = await contract.getAddress();
        setContractAddress(contractAddr);
        setLoading(true);
        await contract.deploymentTransaction()?.wait();

        // Set the necessary game data.
        setLoading(false);

        const storedMove: Player1StoredMove = {
          randomSalt,
          hashedMove,
          valueSelected,
        };

        dispatch(player1AddNewGame(contractAddr, storedMove));
      } catch (error) {
        setLoading(false);
        console.error("Failed to play the game:", error);
        setErrorMessage("Failed to play the game. Please try again."); // Set the error message
      }
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  // Function to close the error snackbar
  const handleCloseSnackbar = () => {
    setErrorMessage(null);
  };

  if (game) {
    console.log(game);
    router.push(`/${contractAddress}`);
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Card
        sx={{
          p: { xs: 1, md: 3 },
          width: "100%",
          mx: "auto",
          mt: 3,
          bgcolor: blue[100],
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            Game Overview
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar>
              <PersonIcon />
            </Avatar>
            <Typography
              variant="body1"
              sx={{ wordBreak: "break-all", overflowWrap: "break-word" }}
            >
              Your Address: <strong>{address || "Not available"}</strong>
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar>
              <PersonIcon />
            </Avatar>
            <Typography
              variant="body1"
              sx={{ wordBreak: "break-all", overflowWrap: "break-word" }}
            >
              Opponent Address: <strong>{opponentAddress}</strong>
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar>
              <AccountBalanceWalletIcon />
            </Avatar>
            <Typography variant="h6">
              Stake: <strong>{stake} ETH</strong>
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar>
              <CasinoIcon />
            </Avatar>
            <Typography variant="h6">
              Selected Value: <strong>{valueSelected || "Not selected"}</strong>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" disabled={loading} onClick={handleBack}>
          Previous
        </Button>
        <Button variant="contained" disabled={loading} onClick={handlePlay}>
          {loading ? <CircularProgress size={24} /> : "Submit"}{" "}
        </Button>
      </Box>
    </Container>
  );
};

export default GameOverview;
