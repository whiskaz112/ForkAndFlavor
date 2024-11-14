const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).send('No Token');
    }
    const user = jwt.verify(token, 'jwtsecret');
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.send('Token Invalid').status(500);
  }
};
