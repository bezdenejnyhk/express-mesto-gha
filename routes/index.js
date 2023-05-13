const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^((http|https:\/\/.)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*\.[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)$/),
    about: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5).max(30),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
