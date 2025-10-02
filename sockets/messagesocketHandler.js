import messageController from '../contollers/messageController.js';

const callState = {}; 
// structure: { "userA-userB": { from, to, type, status, timer } }

function registerChatHandlers(io, socket) {
  // User joins their private room
  socket.on("join-private-room", ({ username, friend }) => {
       
    const roomName = getPrivateRoomName(username, friend);
    if(!callState[roomName]){
      callState[roomName] = { from:friend, to:username, status: "idle"};
    }
    socket.join(roomName);

    const call = callState[roomName];

    // ✅ Show popup ONLY if call is still ringing AND this user is the callee
    if (call && call.status === "ringing" && call.to === username) {
      socket.emit("incoming-call", { from: call.from, type: call.type });
    }
  });

  // 📞 Caller starts the call
  socket.on("start-call", ({ from, to, type }) => {
    const roomName = getPrivateRoomName(from, to);

    // Clear old timer if exists
    if (callState[roomName]?.timer) {
      clearTimeout(callState[roomName].timer);
    }

    // Set TTL for call expiry
    const timer = setTimeout(() => {
      if (callState[roomName] && callState[roomName].status === "ringing") {
        callState[roomName].status = "expired";
        io.to(roomName).emit("clear-call-popup");
        delete callState[roomName];
      }
    }, 30000); // 30s

    // Save new call state
    callState[roomName] = { from, to, type, status: "ringing", timer };

    // ✅ Send popup ONLY to callee
    io.to(roomName).emit("incoming-call", { from, to, type });
  });

  // ✅ Accept call
  socket.on("accept-call", ({ from, to }) => {
    const roomName = getPrivateRoomName(from, to);
    if (callState[roomName]) {
      callState[roomName].status = "accepted";
      clearTimeout(callState[roomName].timer);
    }

    // Notify both users
    io.to(roomName).emit("call-accepted", { from });
    io.to(roomName).emit("clear-call-popup");
  });

  // ❌ Reject call
  socket.on("reject-call", ({ from, to }) => {
    const roomName = getPrivateRoomName(from, to);
    if (callState[roomName]) {
      callState[roomName].status = "rejected";
      clearTimeout(callState[roomName].timer);
    }

    // Notify both users
    io.to(roomName).emit("call-rejected", { from });
    io.to(roomName).emit("clear-call-popup");
  });

  // 💬 Private message
  socket.on("private-message", async ({ from, to, message }) => {
    const roomName = getPrivateRoomName(from, to);
    io.to(roomName).emit("private-message", { from, message });

    await messageController.saveMessageToDB({ from, to, message, room: roomName });
    await messageController.saveMessageToCache({ from, to, message, room: roomName });
  });

  socket.on("disconnect", () => {
    // cleanup if needed
    //console.log("🔗  socket disconnected:", socket.id);

  });
}

function getPrivateRoomName(user1, user2) {
  return [user1, user2].sort().join("-");
}

export default registerChatHandlers;
