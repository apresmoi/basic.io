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
}

const players: { [id: string]: Player } = {}

io.on('connect', (socket) => {
  console.log(`player ${socket.id} connected`)

  players[socket.id] = {
    id: socket.id,
    x: Math.random() * 500,
    y: Math.random() * 500,
    dx: 0,
    dy: 0,
  }

  socket.emit('login_success', players[socket.id])

  socket.on('disconnect', () => {
    console.log(`player ${socket.id} disconnected`)
    delete players[socket.id]
  })
});


http.listen(8081, function () {
  console.log('started on port 8081');
  process.on("SIGINT", closeApp);
  process.on("SIGTERM", closeApp);
});

function closeApp() {
  process.exit(0);
}

export default app