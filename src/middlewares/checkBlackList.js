// blacklistMiddleware.js
const blacklistedTokens = [];

const checkBlacklist = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ error: 'Token revoked. Please log in again.' });
  }

  next(); // Token is valid and not blacklisted
};

const addToBlacklist = (token) => {
  blacklistedTokens.push(token);
};

module.exports = { checkBlacklist, addToBlacklist };