const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.PEOPLE).select('*').order('display_order: 1, created_at', { ascending: false });
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { name, role, bio, photo_url, display_order } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ detail: 'Name is required' });

  const doc = {
    id: newId(),
    name: name.trim(),
    role: role || '',
    bio: bio || '',
    photo_url: photo_url || '',
    display_order: Number.isFinite(display_order) ? display_order : 0,
    created_at: new Date(),
  };
  const { error: insError } = await db.from(Collections.PEOPLE).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.PEOPLE).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Person not found' });
  res.json({ deleted: true });
}));

module.exports = router;
