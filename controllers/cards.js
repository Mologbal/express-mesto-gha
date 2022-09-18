const Card = require('../models/card');

// список необходимых видов ошибок
const { DEFAULT_ERROR, NOT_FOUND_ERROR, BAD_REQUEST_ERROR } = require('../utils/utils');

// создание карточки
const createCard = async (req, res) => {
  const id = req.user._id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: id });
    return res
      .status(200)
      .send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'Некорректные данные карточки' });
    }
    return res
      .status(DEFAULT_ERROR)
      .send({ message: 'С сервером что-то не так :(' });
  }
};

// получение всех карточек
const getCard = async (req, res) => {
  try {
    const card = await Card.find({});
    return res
      .status(200)
      .send(card);
  } catch (err) {
    return res
      .status(DEFAULT_ERROR)
      .send({ message: 'С сервером что-то не так :(' });
  }
};

// удалить карточку
const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: 'Такой карточки не найдено' });
    }
    return res
      .status(200)
      .send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'Некорректные данные запроса' });
    }
    return res
      .status(DEFAULT_ERROR)
      .send({ message: 'С сервером что-то не так :(' });
  }
};

// лайкнуть карточку
const likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(cardId, {
      $addToSet: {
        likes: req.user._id,
      },
    }, { // добавить _id в массив, если его там нет
      new: true,
    });
    if (!card) {
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: 'Такой карточки не найдено' });
    }
    return res
      .status(200)
      .send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'Некорректные данные запроса' });
    }
    return res
      .status(DEFAULT_ERROR)
      .send({ message: 'С сервером что-то не так :(' });
  }
};

// убрать лайк карточке
const dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(cardId, {
      $pull: {
        likes: req.user._id,
      },
    }, { // убрать _id из массива
      new: true,
    });
    if (!card) {
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: 'Такой карточки не найдено' });
    }
    return res
      .status(200)
      .send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'Некорректные данные запроса' });
    }
    return res
      .status(DEFAULT_ERROR)
      .send({ message: 'С сервером что-то не так :(' });
  }
};

module.exports = {
  createCard,
  getCard,
  deleteCard,
  dislikeCard,
  likeCard,
};
