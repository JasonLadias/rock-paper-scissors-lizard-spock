import { ENUMS } from "./constants";


export type Player1StoredMove = {
  randomSalt: Record<string, number>;
  hashedMove: string;
  valueSelected: keyof typeof ENUMS;
}

export type OpponentPlayer2State = "waiting" | "moveSelected" | "timedOut" | "refunded"

export type OpponentPlayer1State = "moveSelected" | "timedOut" | "refunded"

export type Player1State = "waiting" | "refunded" | "resolved"

export type Game = {
  contractAddress: string;
  player1StoredMove: Player1StoredMove | null;
  player: 1 | 2;
}