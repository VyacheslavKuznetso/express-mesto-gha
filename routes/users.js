const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/user');

router.get('/', getUser);

router.get('/:userId', celebrate({ // Валидация приходящих на сервер данных //
  body: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), getUserId);

router.patch('/me', celebrate({ // Валидация приходящих на сервер данных //
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),

}), updateUser);

router.patch('/me/avatar', celebrate({ // Валидация приходящих на сервер данных //
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),

  }),
}), updateAvatar);

module.exports = router;
