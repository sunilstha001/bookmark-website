const { clerkClient } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided or invalid format');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received:', token.substring(0, 20) + '...'); // Log first 20 chars for debugging
    
    // For Clerk, we need to verify the session using the SDK
    try {
      // Verify the token with Clerk
      const verification = await clerkClient.verifyToken(token);
      console.log('Token verified for user:', verification.sub);
      
      // Add user ID to request object
      req.userId = verification.sub;
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;