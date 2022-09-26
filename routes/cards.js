const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// создаст карточку
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(w{3}\.)?([\w-]{1,}\.)+[\w._~:/?#[\]@!$&'()*+,;=]*#?/i),
  }),
}), createCard);

// вернёт карточки
router.get('/cards', getCards);

// удаление карточки по идентификатору
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

// поставит лайк
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

// снимет лайк
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
