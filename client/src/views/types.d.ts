import { Player, Effect } from "../types";

export interface IWorldState {
    self?: Player
    players: Player[]
    keys: string[]
    effects: Effect[]
}
