import express from 'express';
import mongoose from 'mongoose';
import Jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { registerValidatior } from './validations/auth.js';

import UserModel from './models/user.js';

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

app.post('/auth/register', registerValidatior, async (req, res) => {
  // если придёт запрос на эту страницу, проверит, есть ли в нём registerValidation,
  // и если есть - функция пойдёт дальше

  try {
    const errors = validationResult(req);

    if (
      !errors.isEmpty()
      // если ошибки "не пустые"
    ) {
      return res.status(400).json(errors.array());
      // вернуть все ошибки, которые смог провалидировать
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // шифрование пароля в переменной passwordHash

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    // подготовка документа на создание пользователя

    const user = await doc.save();
    // сохранить выше подготовленный документ в mongodb

    const token = Jwt.sign(
      {
        _id: user._id,
        // какую информацию шифруем
      },
      'secret123',
      // ключ шифрования токена
      {
        expiresIn: '30d',
        // через какое время токен перестанет быть валидным
      },
    );
    //

    const { passwordHash, ...userData } = user._doc;
    //  вытаскиваем из user._doc - passwordHash, но использоваться не будет

    res.json({
      ...userData,
      // вернуть только значение doc
      token,
      // возвращаем информацию о пользователе и сам токен
    });
    // если ошибок нет - вернуть успех
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
});

app.listen(port, (err) => {
  // слушатель событий на порте 3000 (port)

  if (err) {
    return console.log(err);
  }

  console.log(`Server listening on port ${port}`);
});
