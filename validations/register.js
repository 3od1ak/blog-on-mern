import { body } from 'express-validator'

export const registerValidatior = [
	body('email', 'Неверный формат почты').isEmail(),
	// проверка поля на то, является ли оно почтой
	body('password', 'Пароль должен быть минимум 5 символов').isLength({
		min: 5,
	}),
	// проверка на кол-во символов в поле
	body('fullName', 'Имя должно содержать минимум 3 символа').isLength({
		min: 3,
	}),
	body('avatarUrl')
		.optional()
		// необязательное поле
		.isURL(),
	// но если поле будет заполнено, проверить, является ли оно ссылкой
]
