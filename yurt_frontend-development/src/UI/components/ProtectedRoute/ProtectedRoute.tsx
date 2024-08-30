import { selectUser } from '@users/usersSlice';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '~/app/hooks';

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const user = useAppSelector(selectUser);

  if (!user || user.user.blocked) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default ProtectedRoute;
