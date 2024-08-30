import mongoose from 'mongoose';
import config from './config';
import User from './models/User';

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, skipping drop....`);
  }
};

const collections = ['users', 'yurts', 'services', 'orders', 'clients'];

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  for (const collection of collections) {
    await dropCollection(db, collection);
  }

  await User.create({
    username: 'Бекболот',
    password: '1',
    phoneNumber: '+996705661271',
    role: 'owner',
    image: null,
  });

  await db.close();
};

void run();
