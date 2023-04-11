const Card = require('../models/card');

const checkCard = (card, res) => {
  if (card) {
    return res.send(card);
  }
  return res
    .status(404)
    .send({ message: 'Карточка с указанным _id не найдена.' });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.deleteOne({ _id: req.params })
    .then((card) => {
      if (card.deletedCount === 0) {
        return res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ message: 'Карточка удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный _id' });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный _id' });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный _id' });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};
