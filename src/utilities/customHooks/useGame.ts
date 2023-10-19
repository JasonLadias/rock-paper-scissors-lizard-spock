import { use } from "react";
import { useAppSelector } from "./storeHooks";
import { Game } from "../types";

type UseGameProps = {
  contractAddress: string | null;
};

const useGame = ({ contractAddress }: UseGameProps): Game | null  => {
  const { games } = useAppSelector((state) => state.game);

  const game = games.find((game) => game.contractAddress === contractAddress);

  return game ?? null;
}

export default useGame;
