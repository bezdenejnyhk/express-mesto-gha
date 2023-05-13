const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const router = require('./routes');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(auth);
app.use(router);

app.use(errors());

app.use((req, res) => {
  res.status(404).send({
    message: 'Запрошен несуществующий роут',
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;// если у ошибки нет статуса, выставляем 500
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'Что-то на серверной стороне...'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`start server on port ${PORT}`);
});
