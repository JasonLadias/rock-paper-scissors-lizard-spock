import Anchor from "@/components/Anchor";
import usePlayer1Wait from "@/utilities/customHooks/usePlayer1Wait";
import { Box, Button, Typography } from "@mui/material";
import { FC } from "react";

type Player2WaitProps = {
  contractAddress: string | null;
  stake: string | null;
};

const Player2Wait: FC<Player2WaitProps> = ({ contractAddress, stake }) => {
  const { player1resolved, player1timeout, refunded, refundRequest } = usePlayer1Wait({ contractAddress });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      {player1resolved ? (
        <>
          <Typography variant="h6">
            The game is Resolved. Please Check your wallet to see if you win or
            lose.
          </Typography>
          <Anchor href="/">
            <Button variant="contained">Go To Homepage</Button>
          </Anchor>
        </>
      ) : player1timeout ? (
        <>
          {refunded ? (
            <>
              <Typography variant="h6">
                2 * {stake} returned to your address as Player 1 timed out
              </Typography>
              <Anchor href="/">
                <Button variant="contained">Go To Homepage</Button>
              </Anchor>
            </>
          ) : (
            <>
              <Typography variant="h6">
                Player 1 timed out. You can either wait or request your funds
                back.
              </Typography>
              <Button onClick={refundRequest} variant="contained">
                Request Funds
              </Button>
            </>
          )}
        </>
      ) : (
        <Typography variant="h6">
          Please Wait for player1 to resolve the game. If he does not in 5
          minutes you can request your funds back.
        </Typography>
      )}
    </Box>
  );
};

export default Player2Wait;
