import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // тип: строка
      required: true,
      // свойство считается обязательным (required)
    },
    text: {
      type: String,
      required: true,
      unique: true,
      // свойство должно быть уникальным
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // type будет ссылаться на отдельную модель "User" и оттуда вытаскивать пользователя
      required: true,
    },
    imageUrl: String,
    // необязательное свойство
  },
  {
    timestamps: true,
    // при создании любого пользователя должны быть время создания и обновления данной сущности
  },
);

export default mongoose.model('Post', PostSchema);
