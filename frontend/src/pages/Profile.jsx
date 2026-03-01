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
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="h-32 bg-gradient-to-r from-navy-600 to-navy-800 relative">
          <div className="absolute -bottom-16 left-8">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              src={user.imageUrl}
              alt={user.fullName}
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-navy-800 mb-2">
                {user.fullName}
              </h1>
              <p className="text-navy-500">@{user.username}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start space-x-4 p-4 bg-navy-50 rounded-xl"
            >
              <div className="p-3 bg-amber-100 rounded-lg">
                <FiMail className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-navy-500 mb-1">Email</p>
                <p className="text-navy-800 font-medium">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </motion.div>

            {/* Member Since */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start space-x-4 p-4 bg-navy-50 rounded-xl"
            >
              <div className="p-3 bg-amber-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-navy-500 mb-1">Member Since</p>
                <p className="text-navy-800 font-medium">
                  {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
            </motion.div>

            {/* User ID */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start space-x-4 p-4 bg-navy-50 rounded-xl md:col-span-2"
            >
              <div className="p-3 bg-amber-100 rounded-lg">
                <FiUser className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-navy-500 mb-1">User ID</p>
                <p className="text-navy-800 font-medium font-mono text-sm break-all">
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
            className="mt-8 p-6 bg-navy-50 rounded-xl"
          >
            <h2 className="text-lg font-semibold text-navy-800 mb-4">
              Account Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-navy-200">
                <span className="text-navy-600">Email verified</span>
                <span className={`font-medium ${
                  user.primaryEmailAddress?.verification?.status === 'verified' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {user.primaryEmailAddress?.verification?.status === 'verified' 
                    ? 'Verified' 
                    : 'Not verified'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-200">
                <span className="text-navy-600">Account type</span>
                <span className="font-medium text-navy-800 capitalize">
                  {user.banned ? 'Banned' : 'Active'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-navy-600">Last sign in</span>
                <span className="font-medium text-navy-800">
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