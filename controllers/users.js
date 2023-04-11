const User = require('../models/user');

const checkUser = (user, res) => {
  if (user) {
    return res.send(user);
  }
  return res
    .status(404)
    .send({ message: 'Пользователь по указанному _id не найден' });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => checkUser(user, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный _id' });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const editProfile = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => checkUser(user, res))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const avatar = req.body;

  User.findByIdAndUpdate(owner, avatar, { new: true, runValidators: true })
    .then((user) => checkUser(user, res))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  editProfile,
  updateAvatar
};