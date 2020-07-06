import * as express from 'express';
import * as socketio from 'socket.io'
import { Server as HttpServer } from 'http';
import { IPlayer, IEffect } from './types';

const app = express();

const http = new HttpServer(app);
const io = socketio(http, { path: '/ws' });

const players: { [id: string]: IPlayer } = {};
let effects: IEffect[] = [];

io.on('connect', (socket) => {
  console.log(`player ${socket.id} connected`);

  addPlayer(socket.id);

  socket.emit('login_success', {
    self: players[socket.id],
    players: Object.values(players).filter(p => p.id !== socket.id),
  });
  socket.broadcast.emit('player_join', players[socket.id]);

  socket.on('request_direction_change', (payload) => {
    setPlayerDirection(socket.id, payload.dx, payload.dy)
  });

  socket.on('request_shoot', (payload) => {
    console.log('request_shoot');
    addEffect(players[socket.id]);
  });

  socket.on('disconnect', () => {
    console.log(`player ${socket.id} disconnected`);
    socket.broadcast.emit('player_leave', { id: socket.id });
    delete players[socket.id];
  });
});

const addPlayer = (id: string): void => {
  players[id] = {
    id,
    x: Math.random() * 500,
    y: Math.random() * 500,
    dx: 0,
    dy: 0,
    dead: false,
  };
}

const setPlayerDirection = (id: string, dx: number, dy: number) => {
  players[id].dx = dx
  players[id].dy = dy
}

const addEffect = (player: IPlayer): void => {
  effects.push({
    player,
    x: player.x,
    y: player.y,
    vx: player.dx,
    vy: player.dy,
    life: 10,
  });
}

const updatePlayers = (): void => {
  Object.values(players).forEach(player => {
    if (player.dx !== 0) player.x += player.dx * 10
    if (player.dy !== 0) player.y += player.dy * 10
  });
}

const updateEffects = (): void => {
  effects = effects.reduce((r, effect) => {
    effect.life--;
    if (effect.life) {
      effect.x += effect.vx * 20
      effect.y += effect.vy * 20
      r.push(effect)
    }
    return r
  }, []);
}

const handleCollisions = (): void => {
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
  });
}

setInterval(() => {
  updatePlayers();
  updateEffects();
  handleCollisions();

  io.emit('update', {
    players,
    effects
  });
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