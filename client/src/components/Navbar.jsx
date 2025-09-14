/* eslint-disable no-unused-vars */
// // frontend/src/components/Navbar.jsx
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../redux/slices/authSlice';

// const Navbar = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return (
//     <nav className="bg-gray-800 py-4">
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         <Link to="/" className="text-xl font-bold text-white">
//           MovieReview
//         </Link>
        
//         <div className="flex space-x-4">
//           <Link to="/" className="text-white hover:text-gray-300">
//             Home
//           </Link>
//           <Link to="/movies" className="text-white hover:text-gray-300">
//             Movies
//           </Link>
          
//           {userInfo ? (
//             <div className="flex items-center space-x-4">
//               <Link to="/profile" className="text-white hover:text-gray-300">
//                 Profile
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex space-x-2">
//               <Link
//                 to="/login"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//               >
//                 Register
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { motion } from 'motion/react';
import { Film, User, LogOut, Home, Search } from 'lucide-react';
import Logo from './Logo';
import { Button } from './ui/button';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film }
  ];

  return (
    <motion.nav 
      className="glass border-b border-border/50 backdrop-blur-xl sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={item.to}
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors group"
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Actions */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {userInfo ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/profile"
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">
                    {userInfo.username}
                  </span>
                </Link>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary glow-primary"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-border/30">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to}
                className="flex flex-col items-center space-y-1 text-foreground/60 hover:text-foreground transition-colors p-2"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;