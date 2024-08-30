# Node-TypeScript-Express-Mongoose

- **TypeScript** - It uses TypeScript.
- **JWT** - It uses JWT Token for Authentication.
- **Middleware for easier async/await** - Catches errors from routes and throws them to express error handler to prevent app crash due to uncaught errors.

## Requirements

### To install and run the project, [NodeJS](https://nodejs.org/en) v8+ is required.

## Installing dependencies

```bash
 npm i
```

# Development

---

## Start dev server

```bash
npm run dev
```

Running the above commands results in

- 🌏**API Server** running at `http://localhost:8000`
- 🛢️**MongoDB** running at `mongodb://127.0.0.1:27017/yurtProject`

## Environment

To edit environment variables, create a file with name `.env` and copy the contents from `.env` to start with.

| Var Name  | Type   | Default                                 | Description                               |
| --------- | ------ | --------------------------------------- | ----------------------------------------- |
| NODE_ENV  | string | `development`                           | API runtime environment. eg: `production` |
| PORT      | number | `8000`                                  | Port to run the API server on             |
| MONGO_URL | string | `mongodb://127.0.0.1:27017/yurtProject` | URL for MongoDB                           |
| SECRET    | string | `iAmSuperBoy`                           | JWT Token's Secret Key                    |

## [ESLint](https://eslint.org/), [Prettier](https://prettier.io/) and [Husky](https://www.npmjs.com/package/husky) configuration was used for development

### To start code analysis using [eslint](https://eslint.org/), you need to run the command:

```bash
npm run lint
```

### To start formatting code using [prettier](https://prettier.io/), you need to run the command

```bash
npm run format
```

## To earn the application, libraries such as:

- ### Dependencies

  - `axios`
  - `bcrypt`
  - `cookie-parser`
  - `cors`
  - `dotenv`
  - `express`
  - `jsonwebtoken`
  - `multer`
  - `phone`

- ### DevDependencies
  - `@types/bcrypt`
  - `@types/cookie-parser`
  - `@types/cors`
  - `@types/express`
  - `@types/jsonwebtoken`
  - `@types/multer`
  - `@types/node`
  - `@typescript-eslint/eslint-plugin`
  - `@typescript-eslint/parser`
  - `eslint`
  - `husky`
  - `nodemon`
  - `prettier`
  - `ts-node`
  - `typescript`

## Project team

---

- #### Alexander Mokeichuk - [GitHub](https://github.com/AlexanderMokeichuk)
- #### Anton Forikov - [GitHub](https://github.com/AntonForikov)