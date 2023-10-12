import { Typography } from "@mui/material";
import { FC } from "react";

type Player1DeckProps = {
  address: string;
  stake: string;
  contract: string;
};


const Player1Deck:FC<Player1DeckProps> = ({ address, stake, contract }) => {
  return (
    <>
      <Typography variant="h6">You have Selected a value</Typography>
      <Typography variant="h6">Please wait for your opponent to select a value</Typography>
    </>
  )
}

export default Player1Deck;
