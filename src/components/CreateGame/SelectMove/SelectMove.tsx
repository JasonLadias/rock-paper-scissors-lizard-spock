import { ENUMS } from "@/utilities/constants";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
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
  valueError
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
      >
        {Object.keys(ENUMS).map((keyEnum) => {
          return (
            <Grid
              onClick={() => handleValueSelected(keyEnum as keyof typeof ENUMS)}
              key={keyEnum}
              item
              xs={2}
              sx={{
                minHeight: "100px",
                p: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: keyEnum === valueSelected ? blue[200] : "white",
                border: "1px solid black",
                borderRadius: 2,
                "&:hover": {
                  cursor: "pointer",
                  bgcolor: blue[400],
                },
              }}
            >
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
        <Button variant="contained" onClick={handleNext} disabled={!valueSelected}>
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default SelectMove;
