const router = require('express').Router();

const { getCard, postCard, geleteCard } = require('../controllers/card');

router.get('/', getCard);
router.post('/', postCard);
router.delete('/:cardId', geleteCard);

module.exports = router;
