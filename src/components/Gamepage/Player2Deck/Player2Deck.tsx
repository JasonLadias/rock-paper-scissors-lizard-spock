import { FC, useState } from "react";
import useTransactionDataPlayer2 from "@/utilities/customHooks/useTransactionDataPlayer2";
import Player2Move from "./Player2Move";
import Player2Wait from "./Player2Wait";
import useGame from "@/utilities/customHooks/useGame";

type Player2DeckProps = {
  address: string;
  stake: string;
  contract: string;
};

const Player2Deck: FC<Player2DeckProps> = ({ address, stake, contract }) => {
  const game = useGame({ contractAddress: contract });

  return (
    <>
      {game?.player2Move ? (
        <Player2Wait contractAddress={contract} stake={stake} />
      ) : (
        <Player2Move
          address={address}
          stake={stake}
          contract={contract}
        />
      )}
    </>
  );
};

export default Player2Deck;
