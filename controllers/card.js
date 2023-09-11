const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(201).send({ data: cards });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .orFail(new Error('ValidationError'))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректный формат name, link или ID' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.id;

  Card.deleteOne({ _id: cardId })
    .orFail(new Error('CastError'))
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(200).send({ data: result });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный формат ID карточки' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotCardEroor'))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'NotCardEroor') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotCardEroor'))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'NotCardEroor') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};
