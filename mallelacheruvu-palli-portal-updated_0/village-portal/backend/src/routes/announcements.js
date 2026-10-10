const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const { category } = req.query;
  const query = { is_published: true };
  if (category && category !== 'all') query.category = category;

  const { data: docs, error: err_docs } = await db.from(Collections.ANNOUNCEMENTS).select('*').match(query).order('created_at', { ascending: false }).limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.get('/latest', asyncHandler(async (req, res) => {
  const db = getDb();
  const limit = parseInt(req.query.limit || '3', 10);

  const { data: docs, error: err_docs } = await db.from(Collections.ANNOUNCEMENTS).select('*').match({ is_published: true }).order('created_at', { ascending: false });
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.get('/admin/all', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.ANNOUNCEMENTS).select('*').order('created_at', { ascending: false }).limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const doc = { id: newId(), ...req.body, created_at: new Date() };
  const { error: insError } = await db.from(Collections.ANNOUNCEMENTS).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { data: existing, error: err_existing } = await db.from(Collections.ANNOUNCEMENTS).select('*').eq('id', id).maybeSingle();
  if (err_existing) throw err_existing;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  if (!existing) return res.status(404).json({ detail: 'Announcement not found' });

  const { error: updError } = await db.from(Collections.ANNOUNCEMENTS).update(req.body).eq('id', id);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  const { data: updated, error: err_updated } = await db.from(Collections.ANNOUNCEMENTS).select('*').eq('id', id).maybeSingle();
  if (err_updated) throw err_updated;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(updated);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.ANNOUNCEMENTS).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Announcement not found' });
  res.json({ deleted: true });
}));

module.exports = router;
