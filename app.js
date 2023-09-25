const { errors } = require('celebrate');
const path = require('path');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');

const app = express();
app.use(helmet());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

mongoose.connect(DB_URL);

// Авторизация //
app.use(auth);

// Роуты, которым авторизация нужна //
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Обработчик валидации celebrate //
app.use(errors());

// Обработчик для несуществующих роутов //
app.use((err, req, res, next) => {
  res.status(404).json({ message: 'Ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`listen ${PORT}`);
});
