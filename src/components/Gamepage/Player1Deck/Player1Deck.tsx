import Anchor from "@/components/Anchor";
import Player1Wait from "@/components/Creategame/Player1Wait";
import useTransactionData from "@/utilities/customHooks/useTransactionData";
import { Button, Typography } from "@mui/material";
import { FC } from "react";

type Player1DeckProps = {
  address: string;
  stake: string;
  contract: string;
};

const Player1Deck: FC<Player1DeckProps> = ({ address, stake, contract }) => {
  const { randomSalt, valueSelected } = useTransactionData(contract);

  return (
    <>
      {randomSalt && randomSalt?.length > 0 && valueSelected ? (
        <>
          <Player1Wait
            contractAddress={contract}
            stake={stake}
            valueSelected={valueSelected}
            salt={randomSalt}
          />
        </>
      ) : (
        <>
          <Typography variant="h6">
            Your Game is lost forever I am sorry
          </Typography>
          <Anchor href="/">
            <Button variant="contained">Go To Homepage</Button>
          </Anchor>
        </>
      )}
    </>
  );
};

export default Player1Deck;
