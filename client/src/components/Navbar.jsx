// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white">
          MovieReview
        </Link>
        
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/movies" className="text-white hover:text-gray-300">
            Movies
          </Link>
          
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-white hover:text-gray-300">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;