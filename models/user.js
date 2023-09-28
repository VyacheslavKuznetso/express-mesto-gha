const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },

  about: {
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
  },

  avatar: {
    type: String,
    required: [true, 'Поле "avatar" должно быть заполнено'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },

  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator(e) {
        return validator.isEmail(e);
      },
      message: 'Некорректный формат email',
    },
  },

  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    minlength: [8, 'Минимальная длина поля "password" - 8'],
    validate: {
      validator(pass) {
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        return regexPassword.test(pass);
      },
      message: 'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру',
    },
    select: false, // необходимо добавить поле select чтобы API не возвращал хеш пароля //
  },
}, { versionKey: false }); // убираем отслеживание версии схемы //

userShema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // в случае аутентификации хеш пароля нужен //
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcryptjs.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userShema);
