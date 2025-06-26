'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const FitStartHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const logoVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(191, 255, 0, 0.3)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    },
    open: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <motion.div 
            variants={logoVariants}
            whileHover="hover"
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative">
              <img src="/logo.jpg" alt="FitStart Logo" className="w-10 h-10 lg:w-12 lg:h-12" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl lg:text-2xl font-bold text-[#2c2c2c] tracking-tight">
                FitStart
              </h1>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block">
                Your Fitness Journey
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'Gyms', 'Services', 'About', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-[#2c2c2c] font-medium transition-colors duration-200 relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#BFFF00] transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav> */}

          {/* Join Us Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-[#BFFF00] text-[#2c2c2c] px-6 py-2.5 lg:px-8 lg:py-3 rounded-full font-semibold text-sm lg:text-base  hover:shadow-sm transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Join Us Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#BFFF00] to-[#a6e600] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          variants={mobileMenuVariants}
          initial="closed"
          animate={isMobileMenuOpen ? "open" : "closed"}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-b-2xl border-t border-gray-100"
        >
          <nav className="px-4 py-6 space-y-4">
            {['Home', 'Gyms', 'Services', 'About', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-gray-700 hover:text-[#2c2c2c] font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isMobileMenuOpen ? 1 : 0, 
                  x: isMobileMenuOpen ? 0 : -20 
                }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#BFFF00]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#2c2c2c]/5 to-transparent rounded-full blur-2xl"></div>
      </div>
    </motion.header>
  );
};

export default FitStartHeader;
