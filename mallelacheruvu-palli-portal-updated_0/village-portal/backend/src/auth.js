const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('./config');
const { getDb } = require('./database');
const { Collections } = require('./models');

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function createAccessToken(data, expiresMinutes) {
  const expiresIn = `${expiresMinutes || config.accessTokenExpireMinutes}m`;
  return jwt.sign({ ...data }, config.secretKey, { algorithm: 'HS256', expiresIn });
}

/**
 * Express middleware equivalent of FastAPI's get_current_admin dependency.
 * Requires an `Authorization: Bearer <token>` header, verifies the JWT,
 * and loads the corresponding user onto req.currentUser.
 */
async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ detail: 'Could not validate admin credentials' });
  }

  try {
    const payload = jwt.verify(token, config.secretKey, { algorithms: ['HS256'] });
    const email = payload.sub;
    if (!email) {
      return res.status(401).json({ detail: 'Could not validate admin credentials' });
    }

    const db = getDb();
    const { data: user, error } = await db.from(Collections.USERS).select('*').match({ email }).maybeSingle();
  if (error) throw error;
    if (!user) {
      return res.status(401).json({ detail: 'Could not validate admin credentials' });
    }

    req.currentUser = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Could not validate admin credentials' });
  }
}

module.exports = { verifyPassword, hashPassword, createAccessToken, requireAdmin };
