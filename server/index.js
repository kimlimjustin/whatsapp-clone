const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json())
app.use(cors());

const UserRouter = require('./Router/user.router');
const {messageRouter, startMessage, createMessage, createGroupMessage} = require('./Router/message.router');
const GroupRouter = require('./Router/group.router');
app.use('/users', UserRouter);
app.use('/messages', messageRouter);
app.use('/group', GroupRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))

const URI = process.env.ATLAS_URI;
mongoose.connect(URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})
const {addUser, removeUser, getUser, users, groups, addUserIntoGroup} = require('./Router/onlineUsers');
io.on('connection', socket => {

    socket.on('disconnect', () => {
        removeUser(socket.id);
    })

    socket.on('startMessage', ({sender, recipient, token, senderEmail}) => {
        startMessage(sender, token, recipient);
        addUser({id: socket.id, email: senderEmail})
    })

    socket.on('sendMessage', ({sender, recipient, token, message}) => {
        createMessage(sender, token, recipient, message)
        .then(res => {
            io.emit('message', res)
        })
    })

    socket.on('sendGroupMessage', ({sender, recipient, token, message}) => {
        createGroupMessage(sender, token, recipient, message)
        .then(res => {
            io.to(res.recipient.code).emit('groupMessage', res)
        })
    })
    
    socket.on('joinGroup', ({group, userInfo}) => {
        socket.join(group);
        addUserIntoGroup({group, userInfo});
    })
})