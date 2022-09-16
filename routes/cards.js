const express = require('express');
const cardRouter = require('express').Router();
const {
  createCard, getCard, deleteCard, dislikeCard, likeCard,
} = require(
  '../controllers/cards',
);

cardRouter.post('/cards', createCard);
cardRouter.get('/cards', express.json(), getCard);
cardRouter.delete('/cards/:cardId', express.json(), deleteCard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRouter;
