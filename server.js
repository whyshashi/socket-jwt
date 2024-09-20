const app = require('./src/app');
const http = require('http');
const socketService = require('./src/services/socketService');

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

socketService.init(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});