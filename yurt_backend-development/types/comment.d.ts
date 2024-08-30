import { Schema } from 'mongoose';

export interface ICommentary extends Document {
  user: Schema.ObjectId;
  text: string;
}
