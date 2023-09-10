const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};


module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(400).send({ message: 'Необходимо указать name и about' });
  }

  return User.findByIdAndUpdate(
    req.params.id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Необходимо указать avatar' });
  }

  return User.findByIdAndUpdate(
    req.params.id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};
