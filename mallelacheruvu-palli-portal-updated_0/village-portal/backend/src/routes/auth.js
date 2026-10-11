const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { verifyPassword, hashPassword, createAccessToken, requireAdmin } = require('../auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const trimmed = (email || '').trim();
  const db = getDb();
  
  // Look up user case-insensitively by email/username
  const { data: user, error: err_user } = await db
    .from(Collections.USERS)
    .select('*')
    .ilike('email', trimmed)
    .maybeSingle();

  if (err_user) throw err_user;

  if (!user || !(await verifyPassword(password, user.password))) {
    return res.status(401).json({ detail: 'Invalid username or password' });
  }

  const token = createAccessToken({ sub: user.email, role: user.role });
  res.json({ access_token: token, token_type: 'bearer', name: user.name, email: user.email });
}));

router.get('/me', requireAdmin, (req, res) => {
  const { name, email, role } = req.currentUser;
  res.json({ name, email, role });
});

router.post('/change-password', requireAdmin, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ detail: 'New password must be at least 4 characters long.' });
  }

  const user = req.currentUser;

  // If current password provided, verify it first
  if (currentPassword) {
    const valid = await verifyPassword(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ detail: 'Current password does not match.' });
    }
  }

  const hashedPassword = await hashPassword(newPassword.trim());
  const db = getDb();
  const { error } = await db
    .from(Collections.USERS)
    .update({ password: hashedPassword })
    .eq('id', user.id);

  if (error) throw error;

  res.json({ status: 'ok', detail: 'Password updated successfully' });
}));

module.exports = router;
