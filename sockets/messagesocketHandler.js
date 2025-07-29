import messageController from '../contollers/messageController.js';

function registerChatHandlers(io, socket) {
  // Global/public message
  socket.on('chat-message', function (data) {
    io.emit('chat-message', data);
  });

  // Private room join
  socket.on('join-private-room', function ({ username, friend }) {
    const roomName = [username, friend].sort().join('-');
    socket.join(roomName);
    //console.log(`${username} joined a private chat with ${friend}`);
  });

  // Private message
  socket.on('private-message', async function ({ from, to, message }) {
    const roomName = [from, to].sort().join('-');
    io.to(roomName).emit('private-message', { from, message });

    await messageController.saveMessageToDB({from, to, message, room:roomName});     // Saving it to DB
    await messageController.saveMessageToCache({from, to, message, room:roomName});  //Saving it to redis
  });

  // Handle disconnect
  socket.on('disconnect', function () {
    // console.log("User is disconnected", socket.id);
  });
}

export default registerChatHandlers;
