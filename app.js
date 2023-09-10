const path = require('path');

const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  req.user = {
    _id: '64fdc2ee6b6bcadfaf1d4a4e',
  };

  next();
});

app.listen(PORT, () => {
  console.log(`listen ${PORT}`);
});
