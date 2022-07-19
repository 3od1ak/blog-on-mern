import { body } from 'express-validator'

export const postCreateValidatior = [
	body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
	body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
	body('tags', 'Неверный формат тегов (нужен массив)').optional().isString(),
	body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]
