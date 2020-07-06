export interface IPlayer {
    id: string
    x: number
    y: number
    dx: number
    dy: number
    dead: boolean
}

export interface IEffect {
    player: Player
    x: number
    y: number
    vx: number
    vy: number
    life: number
}