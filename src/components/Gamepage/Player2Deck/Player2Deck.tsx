import { ENUMS } from "@/utilities/constants";
import { Button, Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
import { FC, useState } from "react";
import RPS from "@/abi/RPS";


type Player2DeckProps = {
  address: string;
  stake: string;
  contract: string;
};

const Player2Deck: FC<Player2DeckProps> = ({ address, stake, contract }) => {
  const [valueSelected, setValueSelected] = useState<null | keyof typeof ENUMS>(
    null
  );

  const handleSelectValue = (value: keyof typeof ENUMS) => {
    setValueSelected(value);
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
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contract, RPS.abi, signer);
      const response = await contractInstance.play(move, {
        value: ethers.parseEther(stake || "0"),
      });
      console.log(response);
      await response.wait();
      alert("Successfully made your move!");
    } catch (error) {
      console.error("Failed to play the game:", error);
      alert("Failed to play the game. See the console for more information.");
    }
  };

  return (
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
            <Grid key={keyEnum} item xs={2} sx={{ minHeight: "100px", p: 1 }}>
              <Button
                variant="contained"
                onClick={() => handleSelectValue(keyEnum as keyof typeof ENUMS)}
              >
                {keyEnum}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      {valueSelected && (
        <Typography variant="h6">You Selected {valueSelected}</Typography>
      )}
      {valueSelected && (
        <Button variant="contained" onClick={playGame}>
          Play
        </Button>
      )}
    </>
  );
};

export default Player2Deck;
