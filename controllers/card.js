const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user._id;
  Card.create({ name, link, owner: _id })

    .then((card) => {
      if (!card) {
        throw new BadRequestError('Некорректный формат name, link или ID');
      }
      res.status(201).send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;

  Card.findById({ _id: id })
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (!result.owner.equals(req.user._id)) {
        throw new ForbiddenError('Доступ запрещен');
      }
      return Card.deleteOne(result).then(res.send(result));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавляем _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные для лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убираем _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятии лайка'));
      } else {
        next(err);
      }
    });
};
