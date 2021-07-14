const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatmessage = require("./utils/message");
const { userJoin, getCurrentUser } = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 4000 || process.env.PORT;

const botName = "Pak Bot";

//Static HTML Folder
app.use(express.static(path.join(__dirname, "public")));

//Exec when a client connects

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    //Getting User Details and then joining it to the room
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //Welcome message
    socket.emit(
      "message",
      formatmessage(
        botName,
        `Welcome to Bolo Pakistan Chat ${user.username}, you are currently in ${user.room} room`
      )
    );
    //Message in chat when a user joins
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatmessage(botName, `${user.username} joined the chat`)
      );

    //Message in chat when a user leaves
    socket.on("disconnect", () => {
      io.to(user.room).emit(
        "message",
        formatmessage(botName, `${username} left the chat`)
      );
    });
    //Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      io.to(user.room).emit("message", formatmessage(user.username, msg));
    });
  });
});

app.use("/", (req, res, next) => {
  return res.json({
    message: "hello world",
    status: `server running on port ${PORT}`,
  });
});
server.listen(PORT, () => {
  console.log(`Backend Sever Running on port ${PORT}`);
});
