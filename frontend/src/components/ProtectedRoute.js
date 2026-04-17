import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  if (!localStorage.getItem('iu_auth')) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
