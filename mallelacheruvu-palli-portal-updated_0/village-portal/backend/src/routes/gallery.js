const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId, toDatetime } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const { category } = req.query;
  const query = category && category !== 'all' ? { category } : {};

  const { data: docs, error: err_docs } = await db.from(Collections.GALLERY_ITEMS).select('*').match(query).order('created_at', { ascending: false }).limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const data = { ...req.body };
  if (data.taken_on) data.taken_on = toDatetime(data.taken_on);

  const doc = { id: newId(), ...data, created_at: new Date() };
  const { error: insError } = await db.from(Collections.GALLERY_ITEMS).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.GALLERY_ITEMS).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Image not found' });
  res.json({ deleted: true });
}));

module.exports = router;
