import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Votes } from '../Votes';

export default function ProtectedRoute({ children }) {
  const { state } = useContext(Votes);
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/signin" />;
}
