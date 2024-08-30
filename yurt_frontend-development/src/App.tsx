import Login from '@users/Login';
import { Route, Routes } from 'react-router-dom';
import Yurts from '@yurts/Yurts';
import CustomLayout from '@customLayout/CustomLayout';
import Profile from '@users/Profile';
import NotFound from '@NotFound/NotFound';
import Access from '@access/Access';
import Services from '@services/Services';
import Orders from '@orders/Orders';
import Reports from '@reports/Reports';
import Clients from '@clients/Clients';
import ProtectedRoute from './UI/components/ProtectedRoute/ProtectedRoute';

const App = () => {
  return (
    <CustomLayout>
      <Routes>
        <Route path={'/login'} element={<Login />} />
        <Route
          path={'/'}
          element={
            <ProtectedRoute>
              <Yurts />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/users'}
          element={
            <ProtectedRoute>
              <Access />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/orders'}
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profile'}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/reports'}
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/services'}
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/clients'}
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route path={'*'} element={<NotFound />} />
      </Routes>
    </CustomLayout>
  );
};

export default App;
