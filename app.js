require('dotenv').config();
const { errors, celebrate } = require('celebrate');
const helmet = require('helmet');

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');
const NotFoundError = require('./errors/not-found-err');
const { createUserValidation, loginUserValidation } = require('./validators/user-validation');

const { PORT, DB_URL } = process.env;

const app = express();
app.use(helmet());
app.disable('x-powered-by');

// Обработчик валидации celebrate
app.use(errors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_URL);

app.post('/signup', celebrate(createUserValidation), createUser); // Валидация приходящих на сервер данных //
app.post('/signin', celebrate(loginUserValidation), login); // Валидация приходящих на сервер данных //

// Авторизация //
app.use(auth);
// Роуты, которым авторизация нужна //
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Обработчик для несуществующих роутов
app.use((req, res, next) => {
  const error = new NotFoundError('Ресурс не найден');
  next(error);
});

app.use((err, req, res, next) => {
  const { status = 500, message } = err; // если у ошибки нет статуса, выставляем 500 //
  res
    .status(status)
    .send({ // проверяем статус и выставляем сообщение в зависимости от него //
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next(err);
});

app.listen(PORT, () => {
  console.log(`listen ${PORT}`);
});
