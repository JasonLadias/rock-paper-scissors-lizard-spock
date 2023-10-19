import { ENUMS } from "./constants";


export type Player1StoredMove = {
  randomSalt: Record<string, number> | Uint8Array;
  hashedMove: string;
  valueSelected: keyof typeof ENUMS;
}

export type OpponentPlayer2State = "waiting" | "moveSelected" | "timedOut" | "refunded"

export type OpponentPlayer1State = "waiting" | "timedOut" | "resolved"

export type Player1State = "waiting" | "refunded" | "resolved"

export type Player2State = "waiting" | "refunded" 

export type Game = {
  contractAddress: string;
  player1StoredMove: Player1StoredMove | null;
  player2Move: null | keyof typeof ENUMS;
  player: 1 | 2;
}