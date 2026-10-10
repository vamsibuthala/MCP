const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.MEMORIES).select('*').match({ status: 'approved' }).order('created_at', { ascending: false }).limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const doc = { id: newId(), ...req.body, status: 'pending', created_at: new Date() };
  const { error: insError } = await db.from(Collections.MEMORIES).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.get('/admin/pending', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.MEMORIES).select('*').match({ status: 'pending' }).limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.put('/admin/:id/moderate', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { data: existing, error: err_existing } = await db.from(Collections.MEMORIES).select('*').eq('id', id).maybeSingle();
  if (err_existing) throw err_existing;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  if (!existing) return res.status(404).json({ detail: 'Memory not found' });

  const { error: updError } = await db.from(Collections.MEMORIES).update({ $set: { status: req.body.status } }).eq('id', id);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  const { data: updated, error: err_updated } = await db.from(Collections.MEMORIES).select('*').eq('id', id).maybeSingle();
  if (err_updated) throw err_updated;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(updated);
}));

module.exports = router;
