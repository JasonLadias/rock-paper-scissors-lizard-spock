import { ENUMS } from "@/utilities/constants";
import { usePlayer2Wait } from "@/utilities/customHooks/usePlayer2Wait";
import { Container, Card, CardContent } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FC } from "react";
import {
  MoveSelectedComponent,
  RefundedComponent,
  TimedOutComponent,
  WaitingComponent,
} from "./StateComponents/StateComponents";

type Player1GameProps = {
  contractAddress: string | null;
  stake: string;
  valueSelected: keyof typeof ENUMS | null;
  salt: Uint8Array | null;
};

const Player1Game: FC<Player1GameProps> = ({
  contractAddress,
  stake,
  valueSelected,
  salt,
}) => {
  const { player2State, player1State, player2move, finishGame, refundRequest } =
    usePlayer2Wait({ contractAddress, salt, valueSelected });

    console.log(window.location)

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {player2State === "refunded" && <RefundedComponent stake={stake} />}
      {player2State === "moveSelected" && (
        <MoveSelectedComponent
          player1State={player1State}
          player2move={player2move}
          valueSelected={valueSelected}
          finishGame={finishGame}
        />
      )}
      {player2State === "timedOut" && (
        <TimedOutComponent
          stake={stake}
          player1State={player1State}
          refundRequest={refundRequest}
        />
      )}
      {player2State === "waiting" && (
        <WaitingComponent
          contractAddress={contractAddress}
          stake={stake}
          valueSelected={valueSelected}
        />
      )}
    </Container>
  );
};

export default Player1Game;
