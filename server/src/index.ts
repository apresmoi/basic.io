import * as express from 'express';
import * as socketio from 'socket.io'
import { Server as HttpServer } from 'http';

const app = express();

const http = new HttpServer(app);
const io = socketio(http, { path: '/ws' });

http.listen(8081, function () {
  console.log('started on port 8081');
  process.on("SIGINT", closeApp);
  process.on("SIGTERM", closeApp);
});

function closeApp() {
  process.exit(0);
}

export default app