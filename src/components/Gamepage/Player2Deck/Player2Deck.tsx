import { FC, useState } from "react";
import useTransactionDataPlayer2 from "@/utilities/customHooks/useTransactionDataPlayer2";
import Player2Move from "./Player2Move";
import Player2Wait from "./Player2Wait";

type Player2DeckProps = {
  address: string;
  stake: string;
  contract: string;
};

const Player2Deck: FC<Player2DeckProps> = ({ address, stake, contract }) => {
  const userPlayed = useTransactionDataPlayer2(contract);
  const [userPlayedState, setUserPlayedState] = useState(false);

  const handleUserPlayed = () => {
    setUserPlayedState(true);
  };

  return (
    <>
      {userPlayed || userPlayedState ? (
        <Player2Wait contractAddress={contract} stake={stake} />
      ) : (
        <Player2Move
          address={address}
          stake={stake}
          contract={contract}
          handleUserPlayed={handleUserPlayed}
        />
      )}
    </>
  );
};

export default Player2Deck;
