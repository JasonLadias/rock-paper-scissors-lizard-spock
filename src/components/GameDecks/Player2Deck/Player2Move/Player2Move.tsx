import Anchor from "@/components/Anchor";
import { ENUMS, GAS_LIMIT } from "@/utilities/constants";
import { ensureMetaMask, getContractInstance } from "@/utilities/helpers";
import usePlayer1Wait from "@/utilities/customHooks/usePlayer1Wait";
import { Button, Grid, Typography, Container, Box,  CircularProgress } from "@mui/material";
import { ethers } from "ethers";
import React, { FC, useState } from "react";
import { blue, red, green } from "@mui/material/colors";
import { useAppDispatch } from "@/utilities/customHooks/storeHooks";
import { player2AddNewGame } from "@/utilities/store/gameSlice";

type Player2MoveProps = {
  address: string;
  stake: string;
  contract: string;
};

const Player2Move: FC<Player2MoveProps> = ({ address, stake, contract }) => {
  const { player1State } = usePlayer1Wait({ contractAddress: contract });
  const [valueSelected, setValueSelected] = useState<null | keyof typeof ENUMS>(
    null
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleSelectValue = (value: keyof typeof ENUMS) => {
    setValueSelected(value);
  };

  /**
   * Plays the game by calling the play function on the contract.
   * - Sets the loading state to true.
   * - Gets the contract instance.
   * - Calls the play function on the contract with the selected move and the stake.
   * - Sets the loading state to false.
   */
  const playGame = async () => {
    if (!valueSelected || !address) {
      alert("Please select a value or connect your wallet first");
      return;
    }

    const move = ENUMS[valueSelected]; // Convert the selected string value to its ENUMS equivalent
    if (!ensureMetaMask()) return;
    try {
      setLoading(true);
      const contractInstance = await getContractInstance(contract, true);

      // Call the play function on the contract
      const response = await contractInstance.play(move, {
        value: ethers.parseEther(stake),
        gasLimit: GAS_LIMIT,
      });
      await response.wait();
      // Set the contract address in local storage and set the user played to true
      // We also raise a useState flag for the parent component to know that the user has played
      dispatch(player2AddNewGame(contract, valueSelected));
      setLoading(false);
    } catch (error) {
      console.error("Failed to play the game:", error);
      setLoading(false);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  return (
    <>
      {player1State === "resolved" ? (
        <>
          <Typography variant="h6">
            You timed out. Player 1 has refunded the amount.
          </Typography>
          <Anchor href="/">
            <Button variant="contained">Go To Homepage</Button>
          </Anchor>
        </>
      ) : (
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography variant="h6" align="center">
            Please Select A Value From Below
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            gap={2}
          >
            {Object.keys(ENUMS).map((keyEnum) => {
              return (
                <Grid
                  onClick={() =>
                    handleSelectValue(keyEnum as keyof typeof ENUMS)
                  }
                  key={keyEnum}
                  item
                  xs={3}
                  md={2}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transformStyle: "preserve-3d",
                      transform:
                        keyEnum === valueSelected
                          ? "rotateY(0deg)"
                          : "rotateY(360deg)",
                      transition: "transform 0.3s",
                      bgcolor:
                        keyEnum === valueSelected ? green[500] : blue[500],
                      borderRadius: 3,
                      ":hover": {
                        cursor: !(keyEnum === valueSelected)
                          ? "pointer"
                          : "not-allowed",
                        bgcolor: !(keyEnum === valueSelected)
                          ? green[500]
                          : red[500],
                        "& img": {
                          transform: !(keyEnum === valueSelected)
                            ? "scale(1.05)"
                            : "unset",
                        },
                      },
                    }}
                  >
                    <img
                      src={"/elements/" + keyEnum + ".jpg"}
                      alt=""
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  {keyEnum}
                </Grid>
              );
            })}
          </Grid>
          {valueSelected && (
            <Typography variant="h6">You Selected {valueSelected}</Typography>
          )}
          {valueSelected && (
            <Button variant="contained" onClick={playGame} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Submit"}{" "}
            </Button>
          )}
        </Container>
      )}
    </>
  );
};

export default Player2Move;
