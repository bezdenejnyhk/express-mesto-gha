const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');

authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^((http|https:\/\/.)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*\.[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)$/),
    about: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required().min(2)
      .max(30),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

authRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5).max(30),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = authRouter;
