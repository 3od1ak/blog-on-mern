import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()
		// подключить связь с объектом user из PostModel и выполнить запрос
		res.json(posts)
		// в posts передаются статьи пользователя, которого получили из .populate('user')
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		// вытащить ид статьи

		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(error)
					res.status(500).json({
						message: 'Не удалось удалить статью',
					})
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Статья не найдена',
					})
				}

				res.json({
					success: true,
				})
			}
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id
		// вытащить ид статьи

		PostModel.findOneAndUpdate(
			// искать статью и её обновить
			{
				_id: postId,
				// параметр поиска
			},
			{
				$inc: { viewsCount: 1 },
				// увеличить значение параметра viewsCount на 1
			},
			{
				returnDocument: 'after',
				// после обновления вернуть актуальный документ
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					return res.status(500).json({
						message: 'Не удалось вернуть статью',
					})
				}

				if (!doc) {
					// если ошибки при поиске нет, но и статья не найдена
					return res.status(404).json({
						message: 'Статья не найдена',
					})
				}

				res.json(doc)
				// если статья найдена и ошибок нет - вернуть сам документ
			}
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags,
				user: req.userId,
			}
		)

		res.json({
			success: true,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось обновить статью',
		})
	}
}
