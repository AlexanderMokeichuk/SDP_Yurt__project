import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Yurt from './models/Yurt';
import Service from './models/Service';
import Order from './models/Order';
import Client from './models/Client';

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

  const [owner, johnDoe, notAdmin] = await User.create(
    {
      username: 'Бекболот',
      password: '1',
      phoneNumber: '+996555111111',
      role: 'owner',
      image: null,
    },
    {
      username: 'John Doe',
      password: '123qwerty',
      phoneNumber: '+996777123123',
      role: 'admin',
      image: null,
    },
    {
      username: 'Not admin',
      password: '1',
      phoneNumber: '+996555555555',
      role: 'moderator',
      image: 'fixtureImages/moderator.png',
    },
  );

  const [yurt1, yurt2, yurt3] = await Yurt.create(
    {
      title: 'Юрта №1',
      pricePerDay: 6500,
      image: 'fixtureImages/yurt1.jpg',
      description: 'Юрта №1',
    },
    {
      title: 'Юрта №2',
      pricePerDay: 5500,
      image: 'fixtureImages/yurt2.jpg',
      description: 'Юрта №2',
    },
    {
      title: 'Юрта №3',
      pricePerDay: 6500,
      image: 'fixtureImages/yurt3.jpg',
      description: 'Юрта №3',
    },
    {
      title: 'Юрта №4',
      pricePerDay: 5500,
      image: 'fixtureImages/yurt4.jpg',
      description: 'Юрта №4',
    },
    {
      title: 'Двухэтажная юрта',
      pricePerDay: 6000,
      image: 'fixtureImages/yurt5.jpg',
      description: 'Двухэтажная юрта',
    },
    {
      title: 'Тойкана "Санжыра"',
      pricePerDay: 9999,
      image: 'fixtureImages/yurt6.jpg',
      description: 'Тойкана "Санжыра',
    },
  );

  const [cookingFood, washingDishes, slaugherTheRam] = await Service.create(
    {
      title: 'Приготовление еды на казане, до 30 чел.',
      price: 1000,
    },
    {
      title: 'Полная мойка посуды',
      price: 500,
    },
    {
      title: 'Разделка барана и его приготовление',
      price: 2000,
    },
  );

  const [client1, client2, client3] = await Client.create(
    {
      clientName: 'Маргарет',
      clientPhone: '+996779510201',
    },
    {
      clientName: 'Джон',
      clientPhone: '+996550510202',
    },
    {
      clientName: 'Роберт',
      clientPhone: '+996701500200',
    },
  );

  const generateNewDate = () => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    return date.toISOString();
  };

  await Order.create(
    {
      yurt: yurt1._id,
      yurtPrice: yurt1.pricePerDay,
      createdBy: johnDoe._id,
      updatedBy: null,
      totalPrice: 6500 + 1500,
      prepaid: 1000,
      client: client1._id,
      orderDate: generateNewDate(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
      services: [
        { _id: cookingFood._id, serviceTitle: cookingFood.title, serviceBookingPrice: 1000 },
        {
          _id: washingDishes._id,
          serviceTitle: washingDishes.title,
          serviceBookingPrice: 500,
        },
      ],
      servicesBookingPrice: 1500,
      commentaries: [
        {
          user: johnDoe._id,
          text: '20-летие',
        },
        {
          user: notAdmin._id,
          text: '30 человек',
        },
      ],
    },
    {
      yurt: yurt2._id,
      yurtPrice: yurt2.pricePerDay,
      createdBy: johnDoe._id,
      updatedBy: notAdmin._id,
      totalPrice: 5500 + 3500,
      prepaid: 2000,
      client: client2._id,
      orderDate: generateNewDate(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      services: [
        { _id: cookingFood._id, serviceTitle: cookingFood.title, serviceBookingPrice: 1000 },
        {
          _id: washingDishes._id,
          serviceTitle: washingDishes.title,
          serviceBookingPrice: 500,
        },
        {
          _id: slaugherTheRam._id,
          serviceTitle: slaugherTheRam.title,
          serviceBookingPrice: 2000,
        },
      ],
      servicesBookingPrice: 3500,
      commentaries: [
        {
          user: johnDoe._id,
          text: 'Тушоо-той',
        },
        {
          user: johnDoe._id,
          text: '30 человек',
        },
      ],
    },
    {
      yurt: yurt3._id,
      yurtPrice: yurt3.pricePerDay,
      createdBy: owner._id,
      updatedBy: johnDoe._id,
      totalPrice: 6500 + 1000,
      prepaid: 1500,
      client: client3._id,
      orderDate: generateNewDate(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      services: [
        { _id: cookingFood._id, serviceTitle: cookingFood.title, serviceBookingPrice: 1000 },
      ],
      servicesBookingPrice: 1000,
      commentaries: [
        {
          user: notAdmin._id,
          text: '15 человек',
        },
      ],
    },
  );

  await db.close();
};

void run();
