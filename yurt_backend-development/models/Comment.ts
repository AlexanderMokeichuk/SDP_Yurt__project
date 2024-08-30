import { Schema, Types } from 'mongoose';
import User from './User';
import { ICommentary } from '../types/comment';

export const CommentSchema = new Schema<ICommentary>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async (value: Types.ObjectId) => await User.findById(value),
      message: 'Пользователь не найден!',
    },
  },
  text: {
    type: String,
    required: [true, 'Пожалуйста, заполните это поле'],
    trim: true,
  },
});
