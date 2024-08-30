import path from 'path';
import { configDotenv } from 'dotenv';

const envFile = process.env['NODE_ENV'] ? `.env.${process.env['NODE_ENV']}` : '.env';

configDotenv({ path: envFile });

const rootPath = __dirname;

const config = {
  rootPath,
  port: (process.env['PORT'] && parseInt(process.env['PORT'])) || '8000',
  publicPath: path.join(rootPath, 'public'),
  mongoose: {
    db: process.env['MONGO_DB_URL'] || 'mongodb://127.0.0.1:27017/yurtProject',
  },
  IpWhiteList: [
    'http://localhost:5173',
    'http://localhost:5183',
    'http://164.90.207.136',
    'http://usonbak.ddns.net',
    'https://usonbak.ddns.net',
  ],
  JwtAccessExpiresAt: 60 * 15,
  JwtRefreshExpiresAt: 1000 * 60 * 60 * 370,
};

export default config;
