const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ detail: 'Message cannot be empty' });
  }

  const doc = { id: newId(), ...req.body, status: 'new', created_at: new Date() };
  const { error: insError } = await db.from(Collections.FEEDBACK).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.get('/admin/all', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.FEEDBACK).select('*').order('created_at', { ascending: false }).limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.put('/admin/:id/review', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { data: existing, error: err_existing } = await db.from(Collections.FEEDBACK).select('*').eq('id', id).maybeSingle();
  if (err_existing) throw err_existing;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  if (!existing) return res.status(404).json({ detail: 'Feedback not found' });

  const { error: updError } = await db.from(Collections.FEEDBACK).update({ $set: { status: 'reviewed' } }).eq('id', id);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  const { data: updated, error: err_updated } = await db.from(Collections.FEEDBACK).select('*').eq('id', id).maybeSingle();
  if (err_updated) throw err_updated;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(updated);
}));

router.delete('/admin/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.FEEDBACK).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Feedback not found' });
  res.json({ deleted: true });
}));

module.exports = router;
