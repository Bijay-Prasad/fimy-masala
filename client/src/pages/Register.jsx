/* eslint-disable no-unused-vars */
// frontend/src/pages/Register.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    const { confirmPassword, ...userData } = formData;
    dispatch(registerUser(userData));
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;