import { body } from 'express-validator';

export const registerValidatior = [
  body('email').isEmail(),
  // проверка поля на то, является ли оно почтой
  body('password').isLength({ min: 5 }),
  // проверка на кол-во символов в поле
  body('fullName').isLength({ min: 3 }),
  body('avatarUrl')
    .optional()
    // необязательное поле
    .isURL(),
  // но если поле будет заполнено, проверить, является ли оно ссылкой
];
