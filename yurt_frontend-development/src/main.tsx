import ReactDOM from 'react-dom/client';
import App from 'App';
import { ConfigProvider } from 'antd';
import ruRu from 'antd/locale/ru_RU.js';
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'app/store';
import { Provider } from 'react-redux';
import { addTokenInterceptors, refreshTokenInterceptors } from 'axiosApi';

addTokenInterceptors(store);
refreshTokenInterceptors(store);

const app = (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <ConfigProvider locale={ruRu}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(app);
