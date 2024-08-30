import express, { NextFunction, Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import auth from '../middleware/Auth';
import permit from '../middleware/Permit';
import VerifyRefreshToken from '../middleware/VerifyRefreshToken';
import config from '../config';
import { clearImages, imagesUpload } from '../multer';
import User from '../models/User';
import { ObjectId } from 'mongodb';
import { IRequestWithUser } from '../types/user';
import phone from 'phone';
import crypto from 'crypto';
import axios from 'axios';

configDotenv();

const usersRouter = express.Router();

usersRouter.post(
  '/register',
  auth,
  permit(['admin', 'owner']),
  imagesUpload.single('image'),
  userRegister,
);
usersRouter.post('/login', userLogin);
usersRouter.get('/refresh', VerifyRefreshToken, userRefreshToken);
usersRouter.get('/', auth, permit(['admin', 'owner']), usersFetchAll);
usersRouter.patch('/editUser/:id', auth, imagesUpload.single('image'), userUpdate);
usersRouter.patch('/toggleBlockUser/:id', auth, permit(['admin', 'owner']), toggleBlockUser);
usersRouter.patch('/toggleRoleChange/:id', auth, permit(['owner']), toggleRoleChange);
usersRouter.post('/send-otp', sendOtp);
usersRouter.post('/verify-otp', verifyOTP);
usersRouter.post('/change-password-via-OTP', auth, changePasswordViaOTP);
usersRouter.delete('/logout', userLogout);
usersRouter.delete('/deleteAvatar', auth, deleteAvatar);

async function userRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const { phoneNumber, username } = req.body;

    const validatePhone = phone(phoneNumber, { country: 'KG' });
    if (!validatePhone.isValid) {
      res.status(400).send({ error: 'Пожалуйста, введите номер в правильном формате.' });
      return;
    }

    const user = new User({
      phoneNumber,
      username,
      password: crypto.randomUUID(),
      image: req.file ? req.file.filename : null,
    });

    await user.save();
    return res.send(user);
  } catch (e) {
    if (req.file?.filename) clearImages(req.file.filename);
    if (e instanceof Error.ValidationError) {
      return res.status(422).send({ error: e });
    }

    next(e);
  }
}

async function userLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (user?.blocked) {
      return res.status(401).send({
        error: {
          ru: 'Вы были заблокированы!',
          kg: 'Сиз бөгөттөлдү!',
        },
      });
    }

    if (!user)
      return res.status(401).send({
        error: {
          ru: 'Номер телефона или пароль не совпадают.',
          kg: 'Телефон номери же сырсөз дал келбейт.',
        },
      });

    const isMatch = await user.checkPassword(password);
    if (!isMatch)
      return res.status(401).send({
        error: {
          ru: 'Номер телефона или пароль не совпадают.',
          kg: 'Телефон номери же сырсөз дал келбейт.',
        },
      });

    const accessToken = jwt.sign({ user: user._id }, `${process.env.JWT_ACCESS}`, {
      expiresIn: `${config.JwtAccessExpiresAt}s`,
    });
    const refreshToken = jwt.sign({ user: user._id }, `${process.env.JWT_REFRESH}`, {
      expiresIn: `${config.JwtRefreshExpiresAt}ms`,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: config.JwtRefreshExpiresAt,
    });

    return res.send({ accessToken, user });
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(422).send({ error: e });
    }

    next(e);
  }
}

async function userRefreshToken(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    const user = await User.findOne({ _id: req.user?.id });

    const accessToken = jwt.sign({ user: req.user?._id }, `${process.env.JWT_ACCESS}`, {
      expiresIn: `${config.JwtAccessExpiresAt}s`,
    });
    const refreshToken = jwt.sign({ user: req.user?._id }, `${process.env.JWT_REFRESH}`, {
      expiresIn: `${config.JwtRefreshExpiresAt}s`,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: config.JwtRefreshExpiresAt,
    });

    return res.send({ accessToken, user });
  } catch (e) {
    next(e);
  }
}

async function usersFetchAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (e) {
    next(e);
  }
}

async function userUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ error: 'Неправильный id!' });
    }
    const _id = new Types.ObjectId(req.params.id);

    const targetUser = await User.findById(_id);
    if (!targetUser) res.status(400).send({ error: 'Нет пользователя с таким ID' });

    if (targetUser) {
      targetUser.username = req.body.username;
      if (req.file?.filename) {
        targetUser.image = req.file.filename;
      }

      await targetUser.save();
      return res.status(200).send(targetUser);
    }
    return res.status(422).send({ error: 'Некоректные данные!' });
  } catch (e) {
    if (req.file?.filename) clearImages(req.file.filename);
    if (e instanceof Error.ValidationError) {
      return res.status(422).send({ error: e });
    }
    next(e);
  }
}

async function toggleBlockUser(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch (e) {
      return res.status(404).send({ error: 'Id пользователя должен быть ObjectId.' });
    }

    const targetUser = await User.findById(_id);

    if (!targetUser) {
      return res.status(400).send({ error: 'Нет пользователя с таким ID' });
    }

    if (targetUser.role === 'owner')
      return res.status(400).send({ error: 'Вы не можете заблокировать владельца сервиса.' });

    if (targetUser.id === req.user?.id)
      return res.status(400).send({ error: 'Вы не можете заблокировать себя.' });

    targetUser.blocked = !targetUser.blocked;
    await targetUser.save();
    return res.send(targetUser);
  } catch (e) {
    next(e);
  }
}

async function toggleRoleChange(req: IRequestWithUser, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch (e) {
      return res.status(404).send({ error: 'Id пользователя должен быть ObjectId.' });
    }

    const targetUser = await User.findById(_id);

    if (!targetUser) res.status(400).send({ error: 'Нет пользователя с таким ID' });
    if (targetUser?.role === 'owner')
      return res.status(400).send({ error: 'Вы не можете сменить роль владельцу сервиса' });

    if (targetUser?.role === 'admin') {
      targetUser.role = 'moderator';
      targetUser.save();
      return res.send(targetUser);
    } else if (targetUser?.role === 'moderator') {
      targetUser.role = 'admin';
      targetUser.save();
      return res.send(targetUser);
    }
  } catch (e) {
    next(e);
  }
}

async function sendOtp(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    const { phoneNumber } = req.body;

    const targetUser = await User.findOne({ phoneNumber });

    if (!targetUser)
      return res.status(404).send({ error: 'There is no user with such phone number.' });

    if (!phoneNumber) {
      return res.status(400).send({ error: 'Номер телефона обязателен.' });
    }

    const validatePhone = phone(phoneNumber, { country: 'KG' });
    if (!validatePhone.isValid) {
      return res.status(400).send({ error: 'Пожалуйста, введите номер в правильном формате.' });
    }

    const transactionId = crypto.randomUUID().replace(/-/g, '');
    const response = await axios.post(
      'https://smspro.nikita.kg/api/otp/send',
      {
        transaction_id: transactionId,
        phone: phoneNumber,
      },
      {
        headers: {
          'X-API-KEY': process.env.SMS_API_KEY,
        },
      },
    );

    if (response.data.status !== 0) {
      return res.status(500).send({ error: response.data });
    }

    return res.send({ phoneNumber, nikitaToken: response.data.token });
  } catch (e) {
    next(e);
  }
}

async function verifyOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { otpCode, nikitaToken, phoneNumber } = req.body;

    const targetUser = await User.findOne({ phoneNumber });

    if (!targetUser)
      return res.status(404).send({ error: 'There is no user with such phone number.' });

    const token = jwt.sign({ user: targetUser?._id }, `${process.env.JWT_ACCESS}`, {
      expiresIn: 60 * 5,
    });

    if (!otpCode || !nikitaToken) {
      return res.status(400).send({ error: 'Код подтверждения и токен обязательны.' });
    }

    const verifyResponse = await axios.post(
      'https://smspro.nikita.kg/api/otp/verify',
      {
        token: nikitaToken,
        code: otpCode,
      },
      {
        headers: {
          'X-API-KEY': process.env.SMS_API_KEY,
        },
      },
    );

    if (verifyResponse.data.status !== 0) {
      return res.status(400).send({ error: 'Неверный OTP код.' });
    }

    return res.status(200).send({ jwtAccessToken: token });
  } catch (e) {
    next(e);
  }
}

async function changePasswordViaOTP(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    const changeCurrentPassword = req.query.changeCurrentPassword as string;

    if (!changeCurrentPassword) {
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).send({ error: 'Поле пароль обязательно.' });
      }

      const targetUser = await User.findById(req.user?._id);

      if (targetUser) {
        targetUser.password = newPassword;
        await targetUser.save();
        return res.send('Password was changed');
      }

      return res.status(404).send({ error: 'Cant change password' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send({ error: 'Оба поля обязательны.' });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).send({ error: 'Пользователь не найден.' });
    }

    const isMatch = await user.checkPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).send({ error: 'Старый пароль неверен.' });
    }

    user.password = newPassword;
    await user.save();

    return res.send({ message: 'Password was changed' });
  } catch (e) {
    next(e);
  }
}

function userLogout(_req: Request, res: Response, next: NextFunction) {
  try {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
    });

    return res.status(200).send('Рефреш токен успешно очищен!');
  } catch (e) {
    next(e);
  }
}

async function deleteAvatar(req: IRequestWithUser, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).send({ error: 'Пользователь не найден.' });
    }
    if (!req.user?.image) {
      return res.status(404).send({ error: 'Фото профиля отсутствует.' });
    }
    clearImages(req.user?.image);
    user.image = null;
    await user.save();
    return res.send(user);
  } catch (e) {
    next(e);
  }
}

export default usersRouter;
