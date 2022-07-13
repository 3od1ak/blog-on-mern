import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    // найти в базе данных пользователя с вводимой почтой

    if (!user) {
      return req.status(404).json({ message: 'Пользователь не найден' });
      // если в user не найден пользователь, высвечиваем пользователю сообщение о том, что его аккаунт не найден
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    // если пользователь нашёлся выше, проверить его пароль в БД с тем, что он прислал
    // проверяются два параметра:
    // req.body.password - пароль в теле запроса от пользователя,
    // user._doc.passwordHash - пароль в документе (до есть в БД)

    if (!isValidPass) {
      return res.status(404).json({ message: 'Неверный логин или пароль' });
      // если пароль, введенный и проверенный выше - не сходятится с тем, что хранится в БД - оповещать его об этом
    }

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
    // создает токен регистрации пользователя в БД

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
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async function (req, res) {
  // если дан запрос на /auth/me, checkAuth решает, нужно ли выполнение дальнейшей функции
  // next() в checkAuth как раз отвечает за успех и дальнейшее выполнение функции

  try {
    const user = await UserModel.findById(req.userId);
    // UserModel должен вытащить пользователя по его userId

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { passwordHash, ...userData } = user._doc;
    // _doc - даннные пользователя из БД

    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
