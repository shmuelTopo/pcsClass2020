const http = require('http');

if (!process.argv[2]) {
  console.log('no port specified');
}

console.log('running');

http.createServer((req, res) => {
  const baseUrl = 'http://' + req.headers.host;
  const url = new URL(req.url, baseUrl);
  const iso = url.searchParams.get('iso');

  if (!iso) {
    res.statusCode = 400;
    return res.end('No ISO code provided');
  }

  //console.log(url.searchParams, iso, url.searchParams.iso);

  /*const url = require('url');
  const theUrl = url.parse(req.url, true);
  //const iso = theUrl.query.iso;
  console.log(theUrl.query, theUrl.query?.iso);*/

  const theDate = new Date(iso);
  let result;

  if (url.pathname === '/api/parsetime') {
    result = {
      hour: theDate.getHours(),
      minute: theDate.getMinutes(),
      second: theDate.getSeconds()
    };
  } else if (url.pathname === '/api/unixtime') {
    result = {unixtime: theDate.getTime()};
  }

  if (result) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(result));
  } else {
    res.statusCode = 404;
    res.write('404. No such endpoint supported by API');
  }
  res.end();
}).listen(process.argv[2]);