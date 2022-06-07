const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io');
global.socketIo = io(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

const mongoose = require('mongoose');
app.use(async (req, res, next) => {
  await mongoose.connect('mongodb://localhost:27017/blog2');
  next();
});

app.use('/authentication', require('./routes/authentication'));
app.use('/posts', require('./routes/posts'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

server.listen(8080);
