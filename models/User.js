import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      // тип: строка
      required: true,
      // свойство считается обязательным (required)
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // свойство должно быть уникальным
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    // необязательное свойство
  },
  {
    timestamps: true,
    // при создании любого пользователя должны быть время создания и обновления данной сущности
  },
);

export default mongoose.model('User', UserSchema);
