//Setting Up WebSocket
const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const roomUsers = document.getElementById("users");

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Joining chatroom
socket.emit("joinRoom", {
  username,
  room,
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Submitting a message

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //Get Message from message box
  const msg = e.target.elements.msg.value;
  //sending a message to the server
  socket.emit("chatMessage", msg);
  //Reset chat box
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Get Room and users

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Output Message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

//Output Room info to DOM
const outputRoomName = (room) => {
  roomName.innerText = `${room}`;
};
const outputUsers = (users) => {
  roomUsers.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    roomUsers.appendChild(li);
  });
};

document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Do you want to leave the chatroom");
  if (leaveRoom) {
    window.location = "../index.html";
  }
});
