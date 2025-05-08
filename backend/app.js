require('dotenv').config();
const express = require("express");
require("./config/db-mongo");
const setupRoutes = require("./routes");
const setupMiddleware = require('./routes/middlewares/middleware');
const systemConfig = require('./config/system-config');
const client = require("./config/pg-client");
const { initializeSocket } = require('./config/socket');

// Set up the express app
const app = express();

setupMiddleware(app);
setupRoutes(app);

const server = require('http').Server(app);

server.listen(systemConfig.port, () => {
    console.info(`App '${systemConfig.appName}' started on port ${systemConfig.port}`);
});

// Initialize Socket.IO with error handling
try {
    console.log('Initializing Socket.IO...');
    const io = initializeSocket(server);
    // console.log('io', io);
    console.log('Socket.IO initialized successfully');
  } catch (error) {
    console.error('Error initializing Socket.IO:', error);
  }
