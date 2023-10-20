import { ENUMS } from "@/utilities/constants";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { blue, red, green } from "@mui/material/colors";
import { FC } from "react";

type SelectMoveProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  valueSelected: keyof typeof ENUMS | null;
  handleValueSelected: (value: keyof typeof ENUMS) => void;
  valueError: boolean | string;
  setValueError: React.Dispatch<React.SetStateAction<boolean | string>>;
};

const SelectMove: FC<SelectMoveProps> = ({
  setStep,
  valueSelected,
  handleValueSelected,
  setValueError,
  valueError,
}) => {
  const validateInput = () => {
    let error = false;
    if (!valueSelected) {
      setValueError("Please select a value");
      error = true;
    }
    return error;
  };

  const handleNext = async () => {
    if (!validateInput()) {
      setStep((step) => step + 1);
    }
  };

  const handlePrevious = () => {
    setStep((step) => step - 1);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {valueError && (
        <Typography color="red" variant="body1">
          {valueError}
        </Typography>
      )}
      <Grid
        container
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={2}
      >
        {Object.keys(ENUMS).map((keyEnum) => {
          return (
            <Grid
              onClick={() => handleValueSelected(keyEnum as keyof typeof ENUMS)}
              key={keyEnum}
              item
              xs={3}
              md={2}

            >
              <Box
                sx={{
                  width: 100,
                  height:  100,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transformStyle: "preserve-3d",
                  transform: keyEnum === valueSelected ? "rotateY(0deg)" : "rotateY(360deg)",
                  transition: "transform 0.3s",
                  bgcolor: (keyEnum === valueSelected) ? green[500] : blue[500],
                  borderRadius: 3,
                  ":hover": {
                    cursor: !(keyEnum === valueSelected) ? "pointer" : "not-allowed",
                    bgcolor: !(keyEnum === valueSelected) ? green[500] : red[500],
                    "& img": {
                      transform: !(keyEnum === valueSelected) ? "scale(1.05)" : "unset",
                    },
                  },
                }}
              >
                <img
                  src={'/elements/' + keyEnum + '.jpg'}
                  alt=""
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />
              </Box>
              {keyEnum}
            </Grid>
          );
        })}
      </Grid>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" onClick={handlePrevious}>
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!valueSelected}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default SelectMove;
