const jwt = require('jsonwebtoken');

const yourJwt = 'random-secret-key';
const getJwtToken = (id) => jwt.sign({ _id: id }, yourJwt, { expiresIn: '7d' }); //настройка сохранения токена сроком на неделю

module.exports = { getJwtToken };