import { useAppDispatch } from "@/utilities/customHooks/storeHooks";
import { hydrate } from "@/utilities/store/store";

import { FC, useEffect } from "react";



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
      {children}
    </>
  );
};

export default Layout;
