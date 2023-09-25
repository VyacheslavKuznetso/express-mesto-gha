const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUser,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/user');

router.get('/', getUser);

router.get('/:userId', celebrate({ // Валидация приходящих на сервер данных //
  body: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), getUserId);

router.post('/signup', celebrate({ // Валидация приходящих на сервер данных //
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),

}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

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
