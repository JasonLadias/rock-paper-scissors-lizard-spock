import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game, Player1StoredMove } from "../types";
import { AppThunk } from "./store";

export interface GameState {
  games: Game[];
}

const initialState: GameState = {
  games: [],
};

const walletSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    addGame: (state, action: PayloadAction<Game>) => {
      state.games.push(action.payload);
    },
  },
});

export const { addGame } = walletSlice.actions;

export const player1AddNewGame =
  (contractAddress: string, player1StoredMove: Player1StoredMove): AppThunk =>
  (dispatch, getState) => {
    const newGame: Game = {
      contractAddress: contractAddress,
      player1StoredMove,
      player: 1,
    };

    dispatch(addGame(newGame));
  };

export const player2AddNewGame =
  (contractAddress: string): AppThunk =>
  (dispatch, getState) => {
    const newGame: Game = {
      contractAddress: contractAddress,
      player1StoredMove: null,
      player: 2,
    };

    dispatch(addGame(newGame));
  };

export default walletSlice.reducer;
