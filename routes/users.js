const express = require('express');
const userRouter = require('express').Router();
const {
  createUser, getUser, getUserId, updateAvatar, updateUser,
} = require(
  '../controllers/users',
);

userRouter.post('/users', createUser);
userRouter.get('/users', express.json(), getUser);
userRouter.get('/users/:userId', express.json(), getUserId);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
