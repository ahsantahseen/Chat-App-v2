const users = [];

//Join user to chat

const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

//Get current users

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

//When user leaves the chat

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//Get all users in a room

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
