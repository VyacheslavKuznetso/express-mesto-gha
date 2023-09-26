const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const path = require('path');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');

const app = express();
app.use(helmet());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

mongoose.connect(DB_URL);

app.post('/signup', celebrate({ // Валидация приходящих на сервер данных //
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),

}), createUser);

// Авторизация //
app.use(auth);
// Роуты, которым авторизация нужна //
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', celebrate({ // Валидация приходящих на сервер данных //
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

// Обработчик валидации celebrate //
app.use(errors());

// Обработчик для несуществующих роутов //
app.use((err, req, res, next) => {
  res.status(404).json({ message: 'Ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`listen ${PORT}`);
});
