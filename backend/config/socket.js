const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  try {
    console.log('Creating Socket.IO instance...');
    io = socketIO(server, {
      // cors: {
      //   origin: "*",
      //   methods: ["GET", "POST"]
      // },
      // transports: ['websocket', 'polling'],
      // pingTimeout: 60000,
      // pingInterval: 25000
    });

    console.log('Setting up Socket.IO connection handlers...');
    // Set up connection handling
    io.on('connection', (socket) => {
      console.log('New client connected with ID:', socket.id);
      
      // Handle poll-specific connections
      socket.on('joinPoll', (pollId) => {
        console.log(`Client ${socket.id} joining poll room:`, pollId);
        const room = `poll/${pollId}`;
        socket.join(room);
        
        // Send welcome message to the specific client
        socket.emit('welcome', {
          message: `Welcome to poll ${pollId}!`,
          timestamp: new Date().toISOString()
        });

        // Notify others in the room
        socket.to(room).emit('userJoined', {
          message: 'A new user has joined the poll',
          timestamp: new Date().toISOString()
        });
      });

      // Handle leaving a poll room
      socket.on('leavePoll', (pollId) => {
        console.log(`Client ${socket.id} leaving poll room:`, pollId);
        const room = `poll/${pollId}`;
        socket.leave(room);
        
        // Notify others in the room
        socket.to(room).emit('userLeft', {
          message: 'A user has left the poll',
          timestamp: new Date().toISOString()
        });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    console.log('Socket.IO setup completed successfully');
    return io;
  } catch (error) {
    console.error('Error in Socket.IO initialization:', error);
    throw error;
  }
};

const getIO = () => {
  if (!io) {
    console.error('Socket.IO not initialized');
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
}; 