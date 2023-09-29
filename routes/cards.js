const { celebrate } = require('celebrate');
const router = require('express').Router();
const {
  createCard,
  deleteCardId,
  cardIdLikes,
  cardIdDislikes,
} = require('../validators/card-validation');

const {
  getCard,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/', getCard);
router.post('/', celebrate(createCard), postCard); // Валидация приходящих на сервер данных //
router.delete('/:cardId', celebrate(deleteCardId), deleteCard); // Валидация приходящих на сервер данных //
router.put('/:cardId/likes', celebrate(cardIdLikes), likeCard); // Валидация приходящих на сервер данных //
router.delete('/:cardId/likes', celebrate(cardIdDislikes), dislikeCard); // Валидация приходящих на сервер данных //

module.exports = router;
