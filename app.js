const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const {
  PORT = 3000,
} = process.env;
const app = express();

// временная "заглушка" по заданию работы
app.use((req, res, next) => {
  req.user = {
    _id: '632392742cd165f229de29af',
  };

  next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(routerUsers);
app.use(routerCards);

// необходимые виды ошибок
const { DEFAULT_ERROR, NOT_FOUND_ERROR } = require('./utils/utils');

app.use('*', (req, res) => {
  res
    .status(NOT_FOUND_ERROR)
    .send({ message: 'Такой страницы не найдено' });
});

function start(req, res) {
  try {
    mongoose.connect('mongodb://localhost:27017/mestodb');
    app.listen(PORT);
  } catch (err) {
    res
      .status(DEFAULT_ERROR)
      .send({ message: 'С сервером что-то не так :(' });
  }
}

start();
