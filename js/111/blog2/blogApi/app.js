const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Mongo = require("mongodb");
const MongoClient = Mongo.MongoClient;
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

/*app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});*/
app.use(require('cors')({
  origin: 'http://localhost:3000',
}));

app.route('/posts')
  .get(async (req, res, next) => {
    const thePosts = await posts.find().toArray();
    res.send(thePosts);
  })
  .post(async (req, res, next) => {
    const newPost = {
      title: req.body.title,
      body: req.body.body,
      author: 'Joe',
      date: new Date()
    };

    await posts.insertOne(newPost);

    res.status(201)
      //.location(`/posts/${newPost._id}`)
      .send(newPost);
  });

app.post('/posts/:id/comments', async (req, res, next) => {
  const newComment = {
    body: req.body.body,
    author: 'Kamala',
    date: new Date()
  };

  const result = await posts.updateOne({ _id: Mongo.ObjectId(req.params.id) }, { $push: { comments: newComment } });

  if (!result.modifiedCount) {
    return res.status(404).send('Not found');
  }

  res.status(201)
    //.location(`/posts/id/${newComment._id}`)
    .send(newComment);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const e = new Error('Not Found');
  e.status = 404;
  next(e);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(8080);
