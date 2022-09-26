const Card = require('../models/card');
const NotFound = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

// выдаст список карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// создаст новую карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные некоректны'));
      } else {
        next(err);
      }
    });
};

// удалит карточку
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFound('Карточка с переданным id не обнаружена');
    })
    .then((card) => {
      if (card.owner.valueOf() !== _id) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => res.status(200).send(deletedCard))
        .catch(next);
    })
    .catch(next);
};

// поставит лайк
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка с переданным id не обнаружена');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для лайка');
      } else {
        next(err);
      }
    });
};

// удалит лайк
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка с переданным id не обнаружена');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
      } else {
        next(err);
      }
    });
};
module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
