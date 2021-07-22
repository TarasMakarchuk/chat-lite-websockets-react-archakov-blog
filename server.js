const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,{cors:{origin:"*"}});

const PORT = 9999;

const rooms = new Map();

app.use(express.json())

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId) ? {
    users: [...rooms.get(roomId).get('users').values()],
    messages: [...rooms.get(roomId).get('messages').values()]
  } : { users: [], messages: []};
  res.json(obj)
});

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map([
      ['users', new Map()],
      ['messages', []],
    ]));
  }
  res.send();
});

io.on('connection', socket => {
  console.log(`Connected ${socket.id}`);

  socket.on('ROOM_JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).emit('ROOM_SET_USERS', users);
  });

  socket.on('ROOM_NEW_MESSAGE', ({ roomId, userName, text }) => {
    const obj = {
      roomId,
      userName,
      text
    };
    rooms.get(roomId).get('messages').push(obj);
    socket.to(roomId).emit('ROOM_NEW_MESSAGE', obj);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if(value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).emit('ROOM_SET_USERS', users);
      }
    });
  });

});

server.listen(PORT, (error) => {
  if (error) {
    throw Error(error);
  }
  console.log(`Server listen on port ${PORT}`);
});