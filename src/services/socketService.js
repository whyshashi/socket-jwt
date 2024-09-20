const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  }).on('connection', (socket) => {
    console.log('New client connected');
    socket.on('chat message', (msg) => {
      io.emit('chat message', { user: socket.decoded.username, message: msg });
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = { init };