import Anchor from "@/components/Anchor";
import { ENUMS, REVERSE_ENUMS } from "@/utilities/constants";
import { p1wins } from "@/utilities/helpers";
import { usePlayer2Wait } from "@/utilities/customHooks/usePlayer2Wait";
import { Box, Button, Typography } from "@mui/material";
import { FC } from "react";

type Player1WaitProps = {
  contractAddress: string | null;
  stake: string;
  valueSelected: keyof typeof ENUMS | null;
  salt: Uint8Array | null;
};

const Player1Wait: FC<Player1WaitProps> = ({
  contractAddress,
  stake,
  valueSelected,
  salt,
}) => {
  const {
    player2played,
    player2timeout,
    refunded,
    resolved,
    gameResolved,
    player2move,
    finishGame,
    refundRequest,
  } = usePlayer2Wait({ contractAddress, salt, valueSelected });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {gameResolved ? (
        <>
          <Typography variant="h6">
            You timed out. Player 2 won the game.
          </Typography>
          <Anchor href="/">
            <Button variant="contained">Go To Homepage</Button>
          </Anchor>
        </>
      ) : player2played ? (
        <>
          {resolved ? (
            <>
              <Typography variant="h6">The game is Resolved</Typography>
              {valueSelected && (
                <Typography variant="h6">
                  {p1wins(ENUMS[valueSelected], player2move) === "Draw"
                    ? "Draw"
                    : p1wins(ENUMS[valueSelected], player2move)
                    ? "You Won"
                    : "You Lost"}
                </Typography>
              )}
              <Anchor href="/">
                <Button variant="contained">Go To Homepage</Button>
              </Anchor>
            </>
          ) : (
            <>
              <Typography variant="h6">
                Player 2 played {REVERSE_ENUMS[player2move]} and you{" "}
                {valueSelected}
              </Typography>
              {valueSelected && (
                <Typography variant="h6">
                  {p1wins(ENUMS[valueSelected], player2move) === "Draw"
                    ? "Draw"
                    : p1wins(ENUMS[valueSelected], player2move)
                    ? "You Won"
                    : "You Lost"}
                </Typography>
              )}
              <Button onClick={finishGame} variant="contained">
                Resolve Game
              </Button>
            </>
          )}
        </>
      ) : player2timeout ? (
        <>
          {refunded ? (
            <>
              <Typography variant="h6">
                {stake} returned to your address as Player 2 timed out
              </Typography>
              <Anchor href="/">
                <Button variant="contained">Go To Homepage</Button>
              </Anchor>
            </>
          ) : (
            <>
              <Typography variant="h6">
                Player 2 timed out. You can either wait or request your funds
                back.
              </Typography>
              <Button onClick={refundRequest} variant="contained">
                Request Funds
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <Typography variant="h6">
            - You bet {stake} ETH and selected {valueSelected}
          </Typography>
          <Typography variant="h6">
            - You are waiting for Player 2 to play.
          </Typography>
          <Typography variant="h6">
            - Give your opponent the following link{" "}
            <span
              style={{ fontWeight: 500, background: "lightgrey", padding: 10 }}
            >
              {window.location.host}/{contractAddress}
            </span>{" "}
            and wait for them to play.
          </Typography>
          <Typography variant="h6">
            - If they do not play in 5 minutes you can request a refund
          </Typography>
        </>
      )}
    </Box>
  );
};

export default Player1Wait;
