import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

export default function About() {
  const authorDescription =
    "Jason is a passionate software engineer based in Greece. He is a full-stack developer with a special interest in blockchain technology. Feel free to reach out at jason.ladias@gmail.com .";
  const gameDescription =
    "This game is the extended version of Rock Paper Scissors. Below you can see the game results. In order to play the game on the blockchain you need to install metamask and connect to the Goerli Testnet.";

  const gameResults = [
    ["", "Rock", "Paper", "Scissors", "Lizard", "Spock"],
    [
      "Rock",
      "-",
      "L - Gets covered from",
      "W - Crushes",
      "W - Crushes",
      "L - Gets vaporized by",
    ],
    [
      "Paper",
      "W - Covers",
      "-",
      "L - Gets cut by",
      "L - Gets eaten by",
      "W - Disproves",
    ],
    [
      "Scissors",
      "L - Gets crushed by",
      "W - Cuts",
      "-",
      "W - Decapitates",
      "L - Gets smashed by",
    ],
    [
      "Lizard",
      "L - Gets crushed by",
      "W - Eats",
      "L - Gets decapitated by",
      "-",
      "W - Poisons",
    ],
    [
      "Spock",
      "W - Vaporizes",
      "L - Gets disproved by",
      "W - Smashes",
      "L - Gets poisoned by",
      "-",
    ],
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h2" gutterBottom>
        About the Game
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia
              component={() => (
                <img
                  src="/details.jpg"
                  alt="Game Image"
                  width={500}
                  height={300}
                  style={{ objectFit: "contain" }}
                />
              )}
            />
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h4">Jason Ladias</Typography>
          <Typography variant="body1" gutterBottom>
            {authorDescription}
          </Typography>
          <Typography variant="h5">Game Description</Typography>
          <Typography variant="body1">{gameDescription}</Typography>
        </Grid>
      </Grid>

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Game Results
      </Typography>
      <Table>
        <TableBody>
          {gameResults.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, index) => (
                <TableCell key={index} align="center">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
