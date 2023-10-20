import usePlayer1Wait from "@/utilities/customHooks/usePlayer1Wait";
import { Container, Typography } from "@mui/material";
import { FC } from "react";
import { ResolvedComponent, TimedOutComponent, WaitingComponent } from "../StateComponents/StateComponents";
import { ENUMS } from "@/utilities/constants";

type Player2WaitProps = {
  contractAddress: string | null;
  stake: string | null;
  move: keyof typeof ENUMS;
};

const Player2Wait: FC<Player2WaitProps> = ({ contractAddress, stake, move }) => {
  const { player1State, player2State, latestMove, loading, refundRequest } =
    usePlayer1Wait({ contractAddress });

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {player1State === "resolved" && <ResolvedComponent />}
      {player1State === "timedOut" && (<TimedOutComponent stake={stake} player2State={player2State} loading={loading} refundRequest={refundRequest}/>)} 
      {player1State === "waiting" && (
        <WaitingComponent contractAddress={contractAddress} latestMove={latestMove} valueSelected={move} stake={stake} />
      )}
    </Container>
  );
};

export default Player2Wait;
