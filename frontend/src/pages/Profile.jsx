import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { FiMail, FiCalendar, FiUser, FiLogOut } from 'react-icons/fi';
import { format } from 'date-fns';

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient - Responsive height */}
        <div className="h-24 sm:h-32 bg-gradient-to-r from-navy-600 to-navy-800 relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              src={user.imageUrl}
              alt={user.fullName}
              className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-12 sm:pt-20 p-4 sm:p-8">
          {/* Header with name and sign out - Stack on mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 mb-1 sm:mb-2 break-words">
                {user.fullName}
              </h1>
              <p className="text-sm sm:text-base text-navy-500">@{user.username}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </motion.button>
          </div>

          {/* Grid - Adjust columns for mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-8">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-navy-50 rounded-lg sm:rounded-xl"
            >
              <div className="p-2 sm:p-3 bg-amber-100 rounded-lg flex-shrink-0">
                <FiMail className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-navy-500 mb-1">Email</p>
                <p className="text-sm sm:text-base text-navy-800 font-medium break-words">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </motion.div>

            {/* Member Since */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-navy-50 rounded-lg sm:rounded-xl"
            >
              <div className="p-2 sm:p-3 bg-amber-100 rounded-lg flex-shrink-0">
                <FiCalendar className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-navy-500 mb-1">Member Since</p>
                <p className="text-sm sm:text-base text-navy-800 font-medium break-words">
                  {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
            </motion.div>

            {/* User ID - Full width on all screens */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-navy-50 rounded-lg sm:rounded-xl md:col-span-2"
            >
              <div className="p-2 sm:p-3 bg-amber-100 rounded-lg flex-shrink-0">
                <FiUser className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-navy-500 mb-1">User ID</p>
                <p className="text-xs sm:text-sm text-navy-800 font-medium font-mono break-all">
                  {user.id}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 sm:mt-8 p-4 sm:p-6 bg-navy-50 rounded-lg sm:rounded-xl"
          >
            <h2 className="text-base sm:text-lg font-semibold text-navy-800 mb-3 sm:mb-4">
              Account Details
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-navy-200 gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-navy-600">Email verified</span>
                <span className={`text-xs sm:text-sm font-medium ${
                  user.primaryEmailAddress?.verification?.status === 'verified' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {user.primaryEmailAddress?.verification?.status === 'verified' 
                    ? 'Verified' 
                    : 'Not verified'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-navy-200 gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-navy-600">Account type</span>
                <span className="text-xs sm:text-sm font-medium text-navy-800 capitalize">
                  {user.banned ? 'Banned' : 'Active'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-navy-600">Last sign in</span>
                <span className="text-xs sm:text-sm font-medium text-navy-800 break-words">
                  {user.lastSignInAt ? format(new Date(user.lastSignInAt), 'MMMM dd, yyyy h:mm a') : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;