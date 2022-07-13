import jwt from 'jsonwebtoken';

// функция - посредник. Решает, можно ли вернуть пользователю какую-то секретную информацию

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  // из запроса ывтащить headers.authorization
  // из первых скобок поменять слово Bearer (если будет) на пустую строку

  if (token) {
    try {
      // если token верный - нужно его расшифровать

      const decoded = jwt.verify(token, 'secret123');
      // метод расшифровки
      // сам token и ключ, по которому будет расшифровка

      req.userId = decoded._id;
      // если токен успешно расшифрован, передать в req.userId то, что расшифровано
      next();
    } catch (error) {
      // если в расшифровке токена произошла какая-то ошибка
      return res.status(403).json({ message: 'Нет доступа' });
    }
  } else {
    return res.status(403).json({
      // 403 - статус отсутствия доступа
      message: 'Нет доступа',
      // сообщение пользователю
    });
  }
};
