import { validationResult } from 'express-validator';

export default (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  // если валидация не прошла - вернуть список ошибок

  next();
  // если валидация прошла без ошибок - идти далее
};
