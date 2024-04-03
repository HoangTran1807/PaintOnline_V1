const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const setupSocket = require('./src/Modules/SocketIO');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors:{
      origin:"*"
    },
  });

app.use(cors());


setupSocket(io);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
