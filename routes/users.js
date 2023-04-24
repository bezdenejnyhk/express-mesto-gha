const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  editProfile,
  updateAvatar,
  getMe
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getMe);
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', editProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
