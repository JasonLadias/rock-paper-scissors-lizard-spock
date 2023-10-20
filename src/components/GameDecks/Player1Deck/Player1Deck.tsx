import Anchor from "@/components/Anchor";
import Player1Game from "@/components/GameDecks/Player1Deck/Player1Game";
import useGame from "@/utilities/customHooks/useGame";
import { Button, Typography } from "@mui/material";
import { FC } from "react";

type Player1DeckProps = {
  address: string;
  stake: string;
  contract: string;
};

const Player1Deck: FC<Player1DeckProps> = ({ address, stake, contract }) => {
  const game = useGame({ contractAddress: contract });

  return (
    <>
      {game?.player1StoredMove ? (
        <Player1Game
          contractAddress={contract}
          stake={stake}
          valueSelected={game?.player1StoredMove.valueSelected}
          salt={game.player1StoredMove.randomSalt instanceof Uint8Array ? null : game.player1StoredMove.randomSalt}
        />
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
