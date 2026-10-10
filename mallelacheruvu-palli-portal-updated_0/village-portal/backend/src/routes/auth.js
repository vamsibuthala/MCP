const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { verifyPassword, createAccessToken, requireAdmin } = require('../auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const { data: user, error: err_user } = await db.from(Collections.USERS).select('*').match({ email }).maybeSingle();
  if (err_user) throw err_user;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;

  if (!user || !(await verifyPassword(password, user.password))) {
    return res.status(401).json({ detail: 'Invalid email or password' });
  }

  const token = createAccessToken({ sub: user.email, role: user.role });
  res.json({ access_token: token, token_type: 'bearer', name: user.name, email: user.email });
}));

router.get('/me', requireAdmin, (req, res) => {
  const { name, email, role } = req.currentUser;
  res.json({ name, email, role });
});

module.exports = router;
