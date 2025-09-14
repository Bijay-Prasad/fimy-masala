// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    // Wake up backend
    axios.get(import.meta.env.VITE_API_URL || 'http://localhost:5000')
      .catch(() => { }); // Ignore errors
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;