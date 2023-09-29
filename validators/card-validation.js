const { Joi } = require('celebrate');

const createCard = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/),
  }),
};

const deleteCardId = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};

const cardIdLikes = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};

const cardIdDislikes = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};

module.exports = {
  createCard,
  deleteCardId,
  cardIdLikes,
  cardIdDislikes,
};
