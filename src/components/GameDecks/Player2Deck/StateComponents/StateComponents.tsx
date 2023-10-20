import Anchor from "@/components/Anchor";
import { ENUMS, FIVE_MINUTES, REVERSE_ENUMS } from "@/utilities/constants";
import { formatTime, p1wins } from "@/utilities/helpers";
import { FC, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
  Link,
  Tooltip,
  IconButton,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CasinoIcon from "@mui/icons-material/Casino";
import LinkIcon from "@mui/icons-material/Link";
import TimerIcon from "@mui/icons-material/Timer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import { blue, red, green, yellow, grey } from "@mui/material/colors";
import { useCountdown } from "@/utilities/customHooks/useCountdown";
import { Player2State } from "@/utilities/types";

export const ResolvedComponent: FC = () => (
  <Card
    sx={{
      p: { xs: 2, md: 4 },
      width: "90%",
      maxWidth: 500,
      mx: "auto",
      mt: 5,
      bgcolor: grey[100],
      boxShadow: 3,
      borderRadius: 2,
      textAlign: "center",
    }}
  >
    <CardContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={2}
        gap={2}
      >
        <Avatar>
          <CasinoIcon />
        </Avatar>
        <Typography variant="h5">
          The game is Resolved. Please Check your wallet to see if you win or
          lose.
        </Typography>
        <Box mt={3}>
          <Anchor href="/">
            <Button variant="contained" color="primary">
              Go To Homepage
            </Button>
          </Anchor>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const TimedOutComponent: FC<{
  stake: string | null;
  player2State: Player2State;
  refundRequest: () => void;
  loading: boolean;
}> = ({ stake, player2State, refundRequest, loading }) => (
  <Card
    sx={{
      p: { xs: 2, md: 4 },
      width: "90%",
      maxWidth: 500,
      mx: "auto",
      mt: 5,
      bgcolor: grey[100],
      boxShadow: 3,
      borderRadius: 2,
      textAlign: "center",
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2} gap={2} >
        <Avatar>
          <ErrorOutlineIcon color="error" />
        </Avatar>
        <Typography variant="h5">
          Player 1 Timed Out
        </Typography>
      </Box>
      {player2State === "refunded" ? (
        <>
          <Typography variant="h6" gutterBottom>
            2 * {stake} ETH has been returned to your address.
          </Typography>
          <Box mt={3}>
            <Anchor href="/">
              <Button variant="contained" color="primary">
                Go To Homepage
              </Button>
            </Anchor>
          </Box>
        </>
      ) : (
        <Box mt={3}>
          <Button
            onClick={refundRequest}
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Request Funds"}
          </Button>
        </Box>
      )}
    </CardContent>
  </Card>
);

export const WaitingComponent: FC<{
  contractAddress: string | null;
  stake: string | null;
  valueSelected: keyof typeof ENUMS | null;
  latestMove: number;
}> = ({ contractAddress, stake, valueSelected, latestMove }) => {

  const endTimeInSeconds = latestMove ? Number(latestMove) + FIVE_MINUTES : 0;
  const timeLeft = useCountdown(endTimeInSeconds);

  return (
    <Card
      sx={{
        p: { xs: 1, md: 3 },
        width: "100%",
        mx: "auto",
        mt: 3,
        bgcolor: blue[100],
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Waiting for Player 1.
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar>
            <TimerIcon />
          </Avatar>
          <Typography variant="body1">
            You are waiting for Player 1 to resolve the game.
            <br />
            {timeLeft > 0 && (
              <Typography component="span" variant="body1">
                {`Time left:`}{" "}
                <Typography component="span" variant="h5">
                  {formatTime(timeLeft)}
                </Typography>
              </Typography>
            )}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar>
            <AccountBalanceWalletIcon />
          </Avatar>
          <Typography variant="h6">
            Stake: <strong>{stake} ETH</strong>
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar>
            <CasinoIcon />
          </Avatar>
          <Typography variant="h6">
            Selected Value: <strong>{valueSelected || "Not selected"}</strong>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};