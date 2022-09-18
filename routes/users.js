const userRouter = require('express').Router();
const {
  createUser, getUser, getUserId, updateAvatar, updateUser,
} = require(
  '../controllers/users',
);

userRouter.post('/users', createUser);
userRouter.get('/users', getUser);
userRouter.get('/users/:userId', getUserId);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
