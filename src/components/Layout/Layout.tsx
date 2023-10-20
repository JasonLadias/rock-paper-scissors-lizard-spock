import { useAppDispatch } from "@/utilities/customHooks/storeHooks";
import { hydrate } from "@/utilities/store/store";
import { AppBar, Stack, Typography } from "@mui/material";

import { FC, useEffect } from "react";
import Anchor from "../Anchor";

export type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Dispatch the hydrate action with the state from localStorage, if it exists
    if (typeof window !== "undefined" && window.localStorage["rpsls-store"]) {
      const preloadedState = JSON.parse(window.localStorage["rpsls-store"]);
      dispatch(hydrate(preloadedState));
    }
  }, [dispatch]);

  return (
    <>
      <AppBar
        elevation={3}
        position="static"
        sx={{ backgroundColor: "background.default" }}
      >
        <Stack
          sx={{ minHeight: 64 }}
          alignItems="stretch"
          direction="row"
          spacing={2}
          flex={1}
          justifyContent="space-around"
        >
          <Anchor href="/">
          <Typography
              sx={{
                paddingTop: 1.5,
              }}
              variant="h5"
              color="black"
            >
              Home
            </Typography>
          </Anchor>
          <Anchor href="/create-game">
            <Typography
              sx={{
                paddingTop: 1.5,
              }}
              variant="h5"
              color="black"
            >
              New Game
            </Typography>
          </Anchor>
          <Anchor href="/about">
            <Typography
              sx={{
                paddingTop: 1.5,
              }}
              variant="h5"
              color="black"
            >
              About
            </Typography>
          </Anchor>
        </Stack>
      </AppBar>
      {children}
    </>
  );
};

export default Layout;
