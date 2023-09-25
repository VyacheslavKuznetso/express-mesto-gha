const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const { getCard, postCard, deleteCard } = require('../controllers/card');

router.get('/', getCard);

router.post('/', celebrate({ // Валидация приходящих на сервер данных //
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),

}), postCard);

router.delete('/:cardId', deleteCard);

module.exports = router;
