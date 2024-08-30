import { Schema, model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserFields, IUserMethods, IUserModel } from '../types/user';

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema<IUserFields, IUserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: [true, 'Поле имени пользователя обязательно!'],
    },
    password: {
      type: String,
      required: [true, 'Поле пароля обязательно!'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Введите номер телефона!'],
      validate: {
        validator: async function (
          this: HydratedDocument<IUserFields>,
          phoneNumber: string,
        ): Promise<boolean> {
          if (!this.isModified('phoneNumber')) return true;

          const user: HydratedDocument<IUserFields> | null = await User.findOne({
            phoneNumber: phoneNumber,
          });
          return !Boolean(user);
        },
        message: 'Данный пользователь уже существует!',
      },
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'moderator', 'owner'],
      default: 'moderator',
    },
    image: String || null,
    blocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false },
);

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = model<IUserFields, IUserModel>('User', UserSchema);

export default User;
