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

export const RefundedComponent: FC<{ stake: string }> = ({ stake }) => (
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="h6" gutterBottom>
      You timed out. Player 2 won the game.
    </Typography>
    <Anchor href="/">
      <Button variant="contained" color="primary">
        Go To Homepage
      </Button>
    </Anchor>
  </Box>
);

export const MoveSelectedComponent: FC<{
  player1State: string;
  player2move: keyof typeof REVERSE_ENUMS;
  valueSelected: keyof typeof ENUMS | null;
  finishGame: () => void;
  loading: boolean;
}> = ({ player1State, player2move, valueSelected, finishGame, loading }) => {
  const gameOutcome =
    valueSelected && p1wins(ENUMS[valueSelected], player2move);
  const bgColor =
    gameOutcome === "Draw" ? yellow[100] : gameOutcome ? green[100] : red[100];

  return (
    <>
      {player1State === "resolved" ? (
        <Card
          sx={{
            p: { xs: 2, md: 4 },
            width: "90%",
            maxWidth: 500,
            mx: "auto",
            mt: 5,
            bgcolor: bgColor,
            boxShadow: 3,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "start" }}>
              The game is Resolved
            </Typography>
            {gameOutcome && (
              <Box
                mb={2}
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                gap={2}
              >
                <Avatar>
                  {gameOutcome === "Draw" ? (
                    <HorizontalSplitIcon sx={{ bgcolor: bgColor }} />
                  ) : gameOutcome ? (
                    <EmojiEventsIcon />
                  ) : (
                    <MoodBadIcon />
                  )}
                </Avatar>
                <Typography variant="h6">
                  {gameOutcome === "Draw"
                    ? "It's a Draw!"
                    : gameOutcome
                    ? "Congratulations! You Won 🥳"
                    : "You Lost 😢"}
                </Typography>
              </Box>
            )}
            <Anchor href="/">
              <Button variant="contained">Go To Homepage</Button>
            </Anchor>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            p: { xs: 2, md: 4 },
            width: "90%",
            maxWidth: 500,
            mx: "auto",
            mt: 5,
            bgcolor: bgColor,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardContent>
            {gameOutcome && (
              <Box
                mb={2}
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                gap={2}
              >
                <Avatar>
                  {gameOutcome === "Draw" ? (
                    <HorizontalSplitIcon sx={{ bgcolor: bgColor }} />
                  ) : gameOutcome ? (
                    <EmojiEventsIcon />
                  ) : (
                    <MoodBadIcon />
                  )}
                </Avatar>
                <Typography variant="h6">
                  {gameOutcome === "Draw"
                    ? "It's a Draw!"
                    : gameOutcome
                    ? "Congratulations! You Won 🥳"
                    : "You Lost 😢"}
                </Typography>
              </Box>
            )}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Avatar>
                <CasinoIcon />
              </Avatar>
              <Typography variant="body1">
                Player 2 played: <strong>{REVERSE_ENUMS[player2move]}</strong>
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Avatar>
                <CasinoIcon />
              </Avatar>
              <Typography variant="body1">
                You Played: <strong>{valueSelected}</strong>
              </Typography>
            </Stack>

            <Box
              mt={3}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                onClick={finishGame}
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Resolve Game"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export const TimedOutComponent: FC<{
  stake: string;
  player1State: string;
  refundRequest: () => void;
  loading: boolean;
}> = ({ stake, player1State, refundRequest, loading }) => (
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
          Player 2 Timed Out
        </Typography>
      </Box>
      {player1State === "refunded" ? (
        <>
          <Typography variant="h6" gutterBottom>
            {stake} ETH has been returned to your address.
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
  stake: string;
  valueSelected: keyof typeof ENUMS | null;
  latestMove: number;
}> = ({ contractAddress, stake, valueSelected, latestMove }) => {
  const [copied, setCopied] = useState(false);

  const endTimeInSeconds = latestMove ? Number(latestMove) + FIVE_MINUTES : 0;
  const timeLeft = useCountdown(endTimeInSeconds);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      // Reset after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    });
  };

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
          Game Overview
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar>
            <TimerIcon />
          </Avatar>
          <Typography variant="body1">
            You are waiting for Player 2 to play.
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

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar>
            <LinkIcon />
          </Avatar>
          <Typography
            variant="h6"
            sx={{ wordBreak: "break-all", overflowWrap: "break-word" }}
          >
            Share this link with your opponent:
            <br />{" "}
            <Link
              href={`${window.location.href}`}
              underline="hover"
              fontWeight={500}
              color={blue[700]}
            >
              {window.location.href}
            </Link>
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton onClick={handleCopyToClipboard}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
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
