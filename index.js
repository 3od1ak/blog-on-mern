import express from 'express';
import mongoose from 'mongoose';

import { registerValidatior } from './validations/auth.js';
import { loginValidatior } from './validations/login.js';
import { postCreateValidatior } from './validations/post.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import { create, getAll, getOne, remove, update } from './controllers/PostControllers.js';

const port = 3000;

mongoose
  .connect(
    'mongodb+srv://admin:12114365ss@cluster0.i6wqn.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error' + err.message));

const app = express();
// создание Express-приложения. Вся логика Express хранится в этой переменной

app.use(express.json());
//  позволяет читать json, который будет приходить в запросы

app.post('/auth/login', loginValidatior, UserController.login);

app.post('/auth/register', registerValidatior, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', getAll);
// - получение всех статей
app.post('/posts', checkAuth, postCreateValidatior, create);
// - создание статьи
app.get('/posts/:id', getOne);
// - получение одной статьи, :id - динамический параметп
app.delete('/posts/:id', checkAuth, remove);
// - удаление статьи
app.patch('/posts/:id', update);
// - обновление статьи

app.listen(port, (err) => {
  // слушатель событий на порте 3000 (port)

  if (err) {
    return console.log(err);
  }

  console.log(`Server listening on port ${port}`);
});
