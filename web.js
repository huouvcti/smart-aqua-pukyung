"use strict";

const { env_var } = require("./env_var");

const app = require('./app');
const http = require('http');

const {socketio} = require('./middleware/socketio');

const port = env_var.S_PORT || 8200;
const server = http.createServer(app);
server.listen(port, () => {
    console.log('Server on ' + port);
});

socketio(server, app);

module.exports = server;


