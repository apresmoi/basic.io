import * as express from 'express';
import * as socketio from 'socket.io'
import { Server as HttpServer } from 'http';

const app = express();

const http = new HttpServer(app);
const io = socketio(http, { path: '/ws' });

interface Player {
  id: string
  x: number
  y: number
  dx: number
  dy: number
  dead: boolean
}

interface Effect {
  player: Player
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

interface Effect {
  player: Player
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

const players: { [id: string]: Player } = {}
let effects: Effect[] = []

io.on('connect', (socket) => {
  console.log(`player ${socket.id} connected`)

  players[socket.id] = {
    id: socket.id,
    x: Math.random() * 500,
    y: Math.random() * 500,
    dx: 0,
    dy: 0,
    dead: false,
  }

  socket.emit('login_success', {
    self: players[socket.id],
    players: Object.values(players).filter(p => p.id !== socket.id),
  })
  socket.broadcast.emit('player_join', players[socket.id])

  socket.on('request_direction_change', (payload) => {
    players[socket.id].dx = payload.x
    players[socket.id].dy = payload.y
  })

  socket.on('request_shoot', (payload) => {
    console.log('request_shoot')
    const player = players[socket.id]
    effects.push({
      player,
      x: player.x,
      y: player.y,
      vx: player.dx,
      vy: player.dy,
      life: 10,
    })
  })

  socket.on('disconnect', () => {
    console.log(`player ${socket.id} disconnected`)
    socket.broadcast.emit('player_leave', { id: socket.id })
    delete players[socket.id]
  })
});

setInterval(() => {
  Object.values(players).forEach(player => {
    if (player.dx !== 0) player.x += player.dx * 10
    if (player.dy !== 0) player.y += player.dy * 10
  })
  effects = effects.reduce((r, effect) => {
    effect.life--;
    if (effect.life) {
      effect.x += effect.vx * 20
      effect.y += effect.vy * 20
      r.push(effect)
    }
    return r
  }, [])

  Object.values(players).forEach(player => {
    const minX = player.x - 10
    const maxX = player.x + 10
    const minY = player.y - 10
    const maxY = player.y + 10
    if (effects.some(effect =>
      effect.x >= minX
      && effect.x <= maxX
      && effect.y >= minY
      && effect.y <= maxY
      && player !== effect.player
    )) {
      player.dead = true;
    }
  })

  // io.sockets.sockets[player]

  io.emit('update', {
    players,
    effects
  })
}, 100)


http.listen(8081, function () {
  console.log('started on port 8081');
  process.on("SIGINT", closeApp);
  process.on("SIGTERM", closeApp);
});

function closeApp() {
  process.exit(0);
}

export default app