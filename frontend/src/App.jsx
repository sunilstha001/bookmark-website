import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Custom appearance for Clerk components (as fallback)
const clerkAppearance = {
  layout: {
    logoPlacement: "none",
    socialButtonsPlacement: "bottom",
    showOptionalFields: false,
  },
  variables: {
    colorPrimary: '#ffa52c',
    colorText: '#1a2842',
    colorBackground: '#ffffff',
    borderRadius: '0.75rem',
  },
};

function App() {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      // Add these props to ensure redirects go to your custom pages
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen bg-gradient-to-br from-navy-50 to-navy-100">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#ffa52c',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes - Custom Sign In and Sign Up pages */}
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              
              {/* Protected routes - require authentication */}
              <Route path="/" element={
                <>
                  <SignedIn>
                    <Layout />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/sign-in" />
                  </SignedOut>
                </>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;