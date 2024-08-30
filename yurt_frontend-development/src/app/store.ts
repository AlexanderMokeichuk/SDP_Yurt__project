import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '@users/usersSlice';
import { yurtsReducer } from '@yurts/yurtsSlice';
import { serviceReducer } from '@services/servicesSlice';
import { ordersReducer } from '@orders/ordersSlice';
import { accessReducer } from '@access/accessSlice';
import { reportsReducer } from '@reports/reportsSlice';
import { clientsReducer } from '@clients/clientsSlice';

const userPersistConfig = {
  key: 'yurt:users',
  storage,
  whitelist: ['user', 'language'],
};

const rootReducer = combineReducers({
  users: persistReducer(userPersistConfig, usersReducer),
  yurts: yurtsReducer,
  services: serviceReducer,
  orders: ordersReducer,
  access: accessReducer,
  reports: reportsReducer,
  clients: clientsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'xmlRequest/sendXmlRequest/fulfilled',
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
