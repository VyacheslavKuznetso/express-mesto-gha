const path = require('path');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();
app.use(helmet());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(DB_URL);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Обработчик для несуществующих роутов //
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ресурс не найден' });
});

app.use((req, res, next) => {
  req.user = {
    _id: '64fdc2ee6b6bcadfaf1d4a4e',
  };

  next();
});

app.listen(PORT, () => {
  console.log(`listen ${PORT}`);
});
