require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

module.exports.login = (req, res) => { // Войти в приложение //
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней //
        sameSite: true,
      })
        .end();

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => { // Запрос информации о пользователе //
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.getUserId = (req, res) => { // Запрос пользователя по id //
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports.createUser = (req, res) => { // Регистрация пользователя //
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcryptjs.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(201).send({ data: user });
        })
        .catch((err) => {
          res.status(500).send({ message: `Произошла ошибка: ${err}` });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка при хешировании пароля: ${err}` });
    });
};

module.exports.updateUser = (req, res) => { // Обновить информацию о пользователе //
  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(400).send({ message: 'Необходимо указать name и about' });
  }

  return User.findByIdAndUpdate(
    req.params.id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный формат ID пользователя' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports.updateAvatar = (req, res) => { // Обновить аватар пользователя //
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Необходимо указать avatar' });
  }

  return User.findByIdAndUpdate(
    req.params.id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .irFail(new Error('NotValidId'))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};
