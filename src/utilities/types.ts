import { ENUMS } from "./constants";


export type Player1StoredMove = {
  randomSalt: Uint8Array;
  hashedMove: string;
  valueSelected: keyof typeof ENUMS;
}

export type Player2State = "waiting" | "moveSelected" | "timedOut" | "refunded"

export type Player1State = "moveSelected" | "timedOut" | "refunded"

export type Game = {
  contractAddress: string;
  player1StoredMove: Player1StoredMove | null;
  player: 1 | 2;
}