const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const ErrorDefault = require('./errors/allErrors');
const NotFound = require('./errors/notFoundError');


const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(w{3}\.)?([\w-]{1,}\.)+[\w._~:/?#[\]@!$&'()*+,;=]*#?/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не найдено'));
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    res.status(ErrorDefault).send({ message: 'Ошибка на стороне сервера' });
  }
  next();
});

app.listen(PORT);
