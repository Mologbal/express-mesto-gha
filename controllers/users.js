const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const { getJwtToken } = require('../utils/jwt');

// выдаст список пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// выдаст пользователя по id
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Такого пользователя не существует');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id'));
      } else {
        next(err);
      }
    });
};

// выдаст информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    if (!user) {
      return next(new NotFound('Такого пользователя не существует'));
    }
    return res.status(200).send(user);
  }).catch((err) => {
    next(err);
  });
};

// создаст нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email или пароль не могут быть пустыми');
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const newUser = { ...user._doc };
      delete newUser.password;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// PR 14 функция входа
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = getJwtToken(user._id);
      return res.send({ token });
    })
    .catch(next);
};

// обновит информацию о пользователе
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound('Такого пользователя не существует');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные пользователя.'));
      } else {
        next(err);
      }
    });
};

// обновит аватарку пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound('Такого пользователя не существует');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, getCurrentUser, updateAvatar, login,
};
