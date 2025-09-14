/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import logoImage from '../assets/filmy-masala-logo.png';

const Logo = ({ className = '', showText = true }) => {
  return (
    <Link to="/" className={`flex items-center space-x-3 ${className}`}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <img 
          src={logoImage} 
          alt="Filmy Masala" 
          className="w-10 h-10 rounded-lg glow-primary"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-accent opacity-20 animate-glow-pulse"></div>
      </motion.div>
      
      {showText && (
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xl font-bold gradient-text">
            Filmy Masala
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Movie Reviews
          </span>
        </motion.div>
      )}
    </Link>
  );
};

export default Logo;