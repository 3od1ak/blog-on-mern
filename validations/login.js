import { body } from 'express-validator';

export const loginValidatior = [
  body('email', 'Неверный формат почты').isEmail(),
  // проверка поля на то, является ли оно почтой
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  // проверка на кол-во символов в поле
];
