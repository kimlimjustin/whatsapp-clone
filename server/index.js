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
const {router, startMessage, createMessage} = require('./Router/message.router');
app.use('/users', UserRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))

const URI = process.env.ATLAS_URI;
mongoose.connect(URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

io.on('connection', socket => {
    //console.log('a user connected.')
    //socket.on('disconnect', () => console.log('a user disconnected.'))
    socket.on('startMessage', ({sender, recipient, token}) => startMessage(sender, token, recipient))
})