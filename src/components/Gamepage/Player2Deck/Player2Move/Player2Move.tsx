import RPS from "@/abi/RPS";
import Anchor from "@/components/Anchor";
import { ENUMS } from "@/utilities/constants";
import { Button, Grid, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { ethers } from "ethers";
import React, { FC, useEffect, useRef, useState } from "react";

type Player2MoveProps = {
  address: string;
  stake: string;
  contract: string;
  handleUserPlayed: () => void;
};

const Player2Move: FC<Player2MoveProps> = ({
  address,
  stake,
  contract,
  handleUserPlayed,
}) => {
  const [valueSelected, setValueSelected] = useState<null | keyof typeof ENUMS>(
    null
  );
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [player1resolved, setPlayer1resolved] = useState(false);

  const handleSelectValue = (value: keyof typeof ENUMS) => {
    setValueSelected(value);
  };

  const checkPlayer1 = async () => {
    if (!contract) return;
    try {
      const ethereum = window?.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);

      const contractInstance = new ethers.Contract(contract, RPS.abi, provider);
      const currentStake = await contractInstance.stake();
      if (Number(currentStake) === 0) {
        setPlayer1resolved(true);
        clearInterval(timerRef.current!);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const playGame = async () => {
    if (!valueSelected || !address) {
      alert("Please select a value or connect your wallet first");
      return;
    }

    const move = ENUMS[valueSelected]; // Convert the selected string value to its ENUMS equivalent

    try {
      const ethereum = window?.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }
      setLoading(true);
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contract, RPS.abi, signer);
      const response = await contractInstance.play(move, {
        value: ethers.parseEther(stake || "0"),
        gasLimit: 1500000,
      });
      await response.wait();
      localStorage.setItem(contract, "true");
      handleUserPlayed();
      setLoading(false);
      clearInterval(timerRef.current!);
    } catch (error) {
      console.error("Failed to play the game:", error);
      setLoading(false);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      checkPlayer1();
    }, 10000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      {player1resolved ? (
        <>
          <Typography variant="h6">You timed out. Player 1 has refunded the amount.</Typography>
          <Anchor href="/">
            <Button variant="contained">Go To Homepage</Button>
          </Anchor>
        </>
      ) : loading ? (
        <Typography variant="h6">
          Your Transaction is being Transmitted. Please wait
        </Typography>
      ) : (
        <>
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
                    handleSelectValue(keyEnum as keyof typeof ENUMS)
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
          {valueSelected && (
            <Typography variant="h6">You Selected {valueSelected}</Typography>
          )}
          {valueSelected && (
            <Button variant="contained" onClick={playGame}>
              Submit
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default Player2Move;
