// app/signout/page.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaSignOutAlt, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut({ redirect: false });
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/error');
      }
    };

    const timer = setTimeout(logout, 1500); // Add slight delay for better UX
    return () => clearTimeout(timer);
  }, [router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const iconVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-purple-50/50 -z-10" />
        
        {/* Logout Icon */}
        <motion.div 
          className="flex justify-center mb-6"
          variants={iconVariants}
          animate="animate"
        >
          <FaSignOutAlt className="text-5xl text-red-600" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 flex items-center justify-center gap-2">
          <FaLock className="text-red-600" />
          Signing Out
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mb-6">
          Securing your session and logging you out...
        </p>

        {/* Spinner and Progress */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <FaSpinner className="text-4xl text-red-600 animate-spin" />
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-600"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Security Message */}
        <motion.p 
          className="text-sm text-center text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Ensuring your data stays safe and secure
        </motion.p>
      </motion.div>
    </div>
  );
}