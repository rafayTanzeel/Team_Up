'use strict';
// Load socket.io module & create new instance
const io = require('socket.io')();

const socketApi = {};
const debugPrefix = 'SocketAPI: ';
const Chat = require('./models/Chat');
const xssFilters = require('xss-filters');

socketApi.io = io;

// Stores users that are connected @ default namespace
let users = [];

// event handler for each connected socket
io.on('connection', (socket) => {
  socket.on('new user', (userData, eventData, callback) => {
    {
      socket.userName = userData.name;
      socket.userId = userData.userId;
      socket.status = userData.status;
      socket.room = eventData.roomId;

      socket.join(socket.room);

      users.push({userId: socket.userId, name: socket.userName, status: socket.status, room: socket.room});

      const filterRoomArr = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].room == socket.room) {
          filterRoomArr.push(users[i]);
        }
      }

      // If users contain duplicates, only keep 1 copy
      const uniqueUsers = filterArray(filterRoomArr);
      // console.log('New socket: ' + uniqueUsers.length);

      io.in(socket.room).emit('updateChatUsers', uniqueUsers);
    }

    // console.log('New User Event - Global socket users: ' + users);
    // Show previous messages of chat history
    Chat.find({'roomId': socket.room}).sort({date: -1}).exec((err, historyChatMsg) => {
      socket.emit('sendChatHistory', historyChatMsg);
    });
  });

  socket.on('chat message', (data) => {
    // Overwrite the message with special characters escaped
    data.message = xssFilters.inHTMLData(data.message);

    const chat = new Chat({
      name: data.name,
      message: data.message,
      date: data.date,
      image: data.image,
      roomId: socket.room,
    });

    chat.save((err, chat) => {
      if (err) {
        console.log('unable to save chat message');
        throw err;
      }
    });

    // Emit chat message to every client in room
    io.in(socket.room).emit('chat message', data);
  });

  // Status updating Logic
  // Don't need to update database because ajax will handle that
  socket.on('userChangedStatus', (data) => {
    let user = {};

    for (let i = 0; i < users.length; i++) {
      // Break after finding user only once since there may be duplicates
      if (users[i].userId == socket.userId) {
        users[i].status = data.status;
        user = users[i];
        break;
      }
    }

    io.emit('updateStatusBroadcast', user);
  });

  socket.on('disconnect', () => {
    // Break after finding user only once
    for (let i = 0; i < users.length; i++) {
      if (users[i].userId == socket.userId) {
        users.splice(i, 1);
        break;
      }
    }

    const filterRoomArr = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].room == socket.room) {
        filterRoomArr.push(users[i]);
      }
    }

    const uniqueUsers = filterArray(filterRoomArr);
    // console.log('Disconnected socket: ' + uniqueUsers.length);

    io.in(socket.room).emit('updateChatUsers', uniqueUsers);
    socket.leave(socket.room);

    // console.log('Disconnect Event - Global socket users: ' + users);
  });
});

// Filter out duplicate objects by userId property
function filterArray(arr) {
  const set = new Set();
  const filteredArr = arr.filter((element) => {
    if (set.has(element.userId)) {
      return false;
    }
    set.add(element.userId);
    return true;
  });

  return filteredArr;
}

module.exports = socketApi;
