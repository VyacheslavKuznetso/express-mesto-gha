const router = require('express').Router();

const {
  getUser,
  getUserId,
  postUser,
  updateUser,
  updateAvatar,
} = require('../controllers/user');

router.get('/', getUser);
router.get('/:userId', getUserId);
router.post('/', postUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
