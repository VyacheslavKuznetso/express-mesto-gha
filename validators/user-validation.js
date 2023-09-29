const { Joi } = require('celebrate');

const createUserValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const loginUserValidation = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const userIdValidation = {
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
};

const userMeValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
};

const userMeAvatarValidation = {
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/),

  }),
};

module.exports = {
  createUserValidation,
  loginUserValidation,
  userIdValidation,
  userMeValidation,
  userMeAvatarValidation,
};
