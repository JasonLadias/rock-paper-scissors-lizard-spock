import {
  Box,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import { FC, useState, useEffect } from "react";
import ConnectWallet from "../ConnectWallet";
import { ENUMS } from "@/utilities/constants";
import Head from "next/head";
import { useAppSelector } from "@/utilities/customHooks/storeHooks";
import SelectOpponent from "./SelectOpponent/";
import SelectStake from "./SelectStake";
import SelectMove from "./SelectMove";
import GameOverview from "./GameOverview";

const CreateGame: FC = () => {
  const { address } = useAppSelector((state) => state.wallet);
  const [valueSelected, setValueSelected] = useState<null | keyof typeof ENUMS>(
    null
  );
  const [valueError, setValueError] = useState<boolean | string>(false);
  const [opponentAddress, setOpponentAddress] = useState("");
  const [opponentAddressError, setOpponentAddressError] = useState<
    boolean | string
  >(false);
  const [stake, setStake] = useState("");
  const [stakeError, setStakeError] = useState<boolean | string>(false);
  const [step, setStep] = useState(0);


  const handleSelectValue = (value: keyof typeof ENUMS) => {
    setValueSelected(value);
    setValueError(false);
  };

  const handleSetStake = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStake(e.target.value);
    setStakeError(false);
  };

  const handleOpponentAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpponentAddress(e.target.value);
    setOpponentAddressError(false);
  };

  useEffect(() => {
    if (address && step === 0) {
      setStep(1);
    } 

    if (!address && step !== 0) {
      setStep(0);
    }

  }, [address, step])
  
  const steps = ["Connect Wallet", "Select Opponent", "Select Stake", "Select Move", "Overview"];

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        py: 10,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Head>
        <title key="title">Rock Paper Scissors Spock Lizard</title>
      </Head>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        color="primary"
      >
        New Game Page
      </Typography>
      <Box
        sx={{
          p: 3,
          bgcolor: yellow[500],
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          textAlign="left"
          color="primary"
        >
          Note: This game should be played on GOERLI TESTNET
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          my: 3,
        }}
      >
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {step === 0 ? (
        <ConnectWallet setStep={setStep} />
      ) : step === 1 ? (
        <SelectOpponent
          setStep={setStep}
          opponentAddress={opponentAddress}
          handleOpponentAddress={handleOpponentAddress}
          opponentAddressError={opponentAddressError}
          setOpponentAddressError={setOpponentAddressError}
        />
      ) : step === 2 ? (
        <SelectStake
          setStep={setStep}
          stake={stake}
          handleStake={handleSetStake}
          stakeError={stakeError}
          setStakeError={setStakeError}
          />
      ) : step === 3 ? (
        <SelectMove
          setStep={setStep}
          valueSelected={valueSelected}
          handleValueSelected={handleSelectValue}
          valueError={valueError}
          setValueError={setValueError}
        />
      ) : step === 4 ? (
        <GameOverview 
          setStep={setStep}
          address={address}
          opponentAddress={opponentAddress}
          stake={stake}
          valueSelected={valueSelected}
        />
      ): (
        <div>Unknown stepIndex</div>
      )}
    </Container>
  );
};

export default CreateGame;
