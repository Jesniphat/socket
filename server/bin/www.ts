/**
 * Module dependencies.
 */
import * as http from 'http';
import { app } from '../app';


/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || 7200);
app.set('port', port);


/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Socket io
 */
const io = require('socket.io')(server, {
  serveClient: false,
  wsEngine: 'ws' // uws is not supported since it is a native module
});

io.on('connection', function (socket) {
  // console.log('User connected');
  socket.on('disconnect', function() {
    // console.log('User disconnected');
  });
  socket.on('save-message', function (data) {
    // console.log('socket = ', data);
    io.emit(data.logindata.type, { loginData: data.logindata, message: data.message });
  });
});


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val): boolean | number {

  const normalizedPort = parseInt(val, 10);

  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
}


/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}
