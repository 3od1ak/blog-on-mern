import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidatior } from './validations/register.js';
import { loginValidatior } from './validations/login.js';
import { postCreateValidatior } from './validations/post.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import { create, getAll, getOne, remove, update } from './controllers/PostControllers.js';
import handleValidationsErrors from './utils/handleValidationsErrors.js';

const port = 3000;

mongoose
  .connect(
    'mongodb+srv://admin:12114365ss@cluster0.i6wqn.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error' + err.message));

const app = express();
// создание Express-приложения. Вся логика Express хранится в этой переменной

const storage = multer.diskStorage({
  // создаем хранилище для мультера
  destination: (_, __, cb) => {
    // функция объясняет, какой путь нужно использовать
    cb(null, 'uploads');
    // функция не получает никаких ошибок
    // сохранить загруженные файлы в папку uploads
  },
  // путь сохранения картинок

  filename: (_, file, cb) => {
    // как будет называться файл
    // file - будет передаваться при отправке запроса
    cb(null, file.originalname);
    // file.originalname - вытащить из file оригинальное название
  },
});
// хранилище для всех картинок

const upload = multer({ storage });
// где храняться файлы мультера

app.use(express.json());
//  позволяет читать json, который будет приходить в запросы
app.use('/uploads', express.static('uploads'));
// сказать Express, что если придет любой запрой на /uploads, с помощью статической функции проверить,
// есть ли в этой папке то, что передается в запросе роута

// --> Роуты аккаунта
app.post('/auth/login', loginValidatior, handleValidationsErrors, UserController.login);
// сначала идёт валидация, если валидационные ошибки есть - парсить их и возвращать
// если ошибок нет - только тогда идёт UserController

app.post('/auth/register', registerValidatior, handleValidationsErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);
// <-- Роуты аккаунта

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  // перед тем, как выполнить что-то, использовать связь upload.single
  // и дальнейшие действия будут только если в upload.single что-то придет
  res.json({
    url: `/uploads/${req.file.originalname}`,
    // путь, по которому сохранена картинка
  });
});

// <-- Роуты постов
app.get('/posts', getAll);
// получение всех статей
app.get('/posts/:id', getOne);
// получение одной статьи, :id - динамический параметп
app.post('/posts', checkAuth, postCreateValidatior, handleValidationsErrors, create);
// создание статьи
app.delete('/posts/:id', checkAuth, remove);
// удаление статьи
app.patch('/posts/:id', checkAuth, postCreateValidatior, handleValidationsErrors, update);
// обновление статьи
// <-- Роуты постов

app.listen(port, (err) => {
  // слушатель событий на порте 3000 (port)

  if (err) {
    return console.log(err);
  }

  console.log(`Server listening on port ${port}`);
});
