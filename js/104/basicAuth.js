module.exports = (userInfo = { name: 'joe', pwd: 'putin' }) => {
  return (req, res, next) => {
    //console.log(req, req.headers);

    if (req.headers.authorization) {
      const userNamePwd = req.headers.authorization.split(' ')[1];

      const buffer = Buffer.from(userNamePwd, 'base64');
      const userNamePwdString = buffer.toString();
      const userNamePwdArray = userNamePwdString.split(':');

      if (userNamePwdArray[0] === userInfo.name && userNamePwdArray[1] === userInfo.pwd) {
        return next();
      }
    }

    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="PCS Realm"' });
    res.end();
  };
}