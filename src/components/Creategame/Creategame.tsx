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
import Player1Game from "./Player1Game";
import { ENUMS } from "@/utilities/constants";
import Player1Wait from "./Player1Wait";
import Head from "next/head";
import { useAppSelector } from "@/utilities/customHooks/storeHooks";
import DisconnectWallet from "../DisconnectWallet";

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
  const [salt, setSalt] = useState<null | Uint8Array>(null);
  const [contractAddress, setContractAddress] = useState<null | string>(null);

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
  
  const steps = ["Connect Wallet", "Select Opponent", "Select Stake", "Select Move"];

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        py: 10,
        display: "flex",
        flexDirection: "column",
        gap: 5,
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
      {address && (<Box>
        <DisconnectWallet />
      </Box>)}
      {step === 0 ? (
        <ConnectWallet setStep={setStep} />
      ) : step === 1 ? (
        <Player1Game
          address={address}
          setStep={setStep}
          valueSelected={valueSelected}
          opponentAddress={opponentAddress}
          stake={stake}
          handleValueSelected={handleSelectValue}
          handleOpponentAddress={handleOpponentAddress}
          handleStake={handleSetStake}
          valueError={valueError}
          opponentAddressError={opponentAddressError}
          stakeError={stakeError}
          setValueError={setValueError}
          setOpponentAddressError={setOpponentAddressError}
          setStakeError={setStakeError}
          setSalt={setSalt}
          setContractAddress={setContractAddress}
        />
      ) : step === 2 ? (
        <Player1Wait
          contractAddress={contractAddress}
          stake={stake}
          valueSelected={valueSelected}
          salt={salt}
        />
      ) : (
        <div>Unknown stepIndex</div>
      )}
    </Container>
  );
};

export default CreateGame;
