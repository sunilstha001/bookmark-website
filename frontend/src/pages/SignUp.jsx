import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { FiBookmark } from 'react-icons/fi';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-navy-100 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md mx-auto" // Smaller max width
      >
        {/* Logo and Branding - Smaller on mobile */}
        <div className="text-center mb-4 sm:mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl shadow-lg mb-2 sm:mb-3"
          >
            <FiBookmark className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-800 mb-1">Join Markly</h1>
          <p className="text-xs sm:text-sm text-navy-500">Create your account to start bookmarking</p>
        </div>

        {/* Clerk Sign-Up Component with Custom Appearance - Smaller padding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-navy-100"
        >
          <SignUp 
            routing="path" 
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
            appearance={{
              layout: {
                logoPlacement: "none",
                socialButtonsPlacement: "bottom",
                showOptionalFields: false,
              },
              variables: {
                colorPrimary: '#ffa52c',
                colorText: '#1a2842',
                colorTextSecondary: '#4164a5',
                colorBackground: '#ffffff',
                colorInputBackground: '#f8fafc',
                colorInputText: '#1a2842',
                colorDanger: '#ef4444',
                borderRadius: '0.5rem', // Smaller border radius
                fontFamily: 'Inter, system-ui, sans-serif',
              },
              elements: {
                card: {
                  boxShadow: 'none',
                  border: 'none',
                  padding: '1.25rem', // Reduced padding
                },
                header: {
                  display: 'none', // Hide default header
                },
                headerTitle: {
                  display: 'none',
                },
                headerSubtitle: {
                  display: 'none',
                },
                socialButtonsBlockButton: {
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  color: '#1a2842',
                  fontWeight: 500,
                  height: '2.5rem', // Smaller height
                  fontSize: '0.875rem', // Smaller font
                  marginBottom: '0.5rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    borderColor: '#ffa52c',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  },
                },
                socialButtonsBlockButtonText: {
                  color: '#1a2842',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                },
                divider: {
                  margin: '0.75rem 0', // Smaller margin
                },
                dividerLine: {
                  backgroundColor: '#e2e8f0',
                  height: '1px',
                },
                dividerText: {
                  color: '#4164a5',
                  fontSize: '0.75rem', // Smaller font
                  fontWeight: 500,
                  padding: '0 0.5rem',
                },
                formField: {
                  marginBottom: '0.75rem', // Smaller margin
                },
                formFieldLabel: {
                  color: '#1a2842',
                  fontWeight: 500,
                  fontSize: '0.8rem', // Smaller font
                  marginBottom: '0.125rem',
                },
                formFieldInput: {
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 0.75rem', // Smaller padding
                  backgroundColor: '#f8fafc',
                  color: '#1a2842',
                  fontSize: '0.875rem', // Smaller font
                  height: '2.5rem', // Fixed height
                  transition: 'all 0.2s',
                  '&:focus': {
                    borderColor: '#ffa52c',
                    boxShadow: '0 0 0 3px rgba(255, 165, 44, 0.2)',
                    backgroundColor: '#ffffff',
                  },
                  '&::placeholder': {
                    color: '#94a3b8',
                    fontSize: '0.875rem',
                  },
                },
                formButtonPrimary: {
                  background: 'linear-gradient(135deg, #4164a5 0%, #1a2842 100%)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem', // Smaller font
                  fontWeight: 600,
                  padding: '0.5rem 0.75rem', // Smaller padding
                  height: '2.5rem', // Smaller height
                  marginTop: '0.25rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f7ac9 0%, #273c63 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  },
                },
                footer: {
                  padding: '0', // Remove default padding
                },
                footerAction: {
                  padding: '1rem 0 0', // Smaller padding
                  borderTop: '1px solid #e2e8f0',
                  marginTop: '0.5rem',
                },
                footerActionText: {
                  color: '#4164a5',
                  fontSize: '0.8rem', // Smaller font
                },
                footerActionLink: {
                  color: '#ffa52c',
                  fontWeight: 600,
                  fontSize: '0.8rem', // Smaller font
                  marginLeft: '0.25rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: '#cc8423',
                    textDecoration: 'underline',
                  },
                },
                alert: {
                  borderRadius: '0.5rem',
                  backgroundColor: '#fff5f5',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '0.5rem 0.75rem', // Smaller padding
                  marginBottom: '0.75rem',
                  fontSize: '0.8rem', // Smaller font
                },
              },
            }}
          />
        </motion.div>

        {/* Development Mode Badge */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
            Development Mode
          </span>
        </div>

        {/* Footer */}
        <p className="text-center mt-4 text-xs text-navy-400 px-2">
          Secured by{' '}
          <a 
            href="https://www.clerk.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-600 transition-colors"
          >
            Clerk
          </a>
          {' • '}
          <span>© {new Date().getFullYear()} Markly</span>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;