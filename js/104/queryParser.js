module.exports = (req, res, next) => {
  const baseUrl = 'http://' + req.headers.host;
  const url = new URL(req.url, baseUrl);
  req.searchParams = url.searchParams;

  /*const url = require('url');
  const theUrl = url.parse(req.url, true);
  req.query = theUrl.query;*/

  next();
}