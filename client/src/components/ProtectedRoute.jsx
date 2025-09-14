// frontend/src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;