const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Сначала авторизируйтесь');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'random-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Сначала авторизируйтесь'));
    return;
  }

  req.user = payload;

  next();
};
