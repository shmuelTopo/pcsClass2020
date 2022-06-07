var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const MongoClient = require("mongodb").MongoClient;
const uri =
  'mongodb://localhost:27017';
const client = new MongoClient(uri);

let posts;
app.use(async (req, res, next) => {
  await client.connect();
  const database = client.db('blog2');
  posts = database.collection('posts');

  next();
});

app.get('/', async (req, res, next) => {
  const thePosts = await posts.find().toArray();
  res.render('layout', {
    posts: thePosts,
    subtitle: 'Welcome to my blog',
    links: [{url: '/addPost', text: 'Add a post'}],
    partials: { content: 'posts' }
  });
});

app.route('/addPost')
  .get((req, res, next) => {
    res.render('layout', {
      subtitle: 'Add a new post',
      links: [{ url: '/', text: 'Home' }],
      partials: { content: 'addPost' }
    })
  })
  .post((req, res, next) => {
    const newPost = {
      title: req.body.title,
      body: req.body.body,
      author: 'Joe',
      date: new Date()
    };
    posts.insertOne(newPost);
    res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.locals.title = "PCS Mongo Express Blog"
module.exports = app;
