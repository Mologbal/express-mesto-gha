const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFound = require('./errors/notFoundError');
const ErrorDefault = require('./errors/allErrors');
const loginAndRegister = require('./routes/index');
const { auth } = require('./middlewares/auth');

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', loginAndRegister);

app.use(auth);
app.use(
  cors({
    origin: 'https://mologbal.nomoredomains.icu',
    credentials: true,
  }),
);
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    res.status(ErrorDefault).send({ message: 'Internal Server Error' });
  }
  next();
});

app.listen(PORT);
