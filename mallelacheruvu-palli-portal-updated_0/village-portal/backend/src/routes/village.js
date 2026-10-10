const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// ---------- Village info (single document) ----------

router.get('/info', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: info, error: err_info } = await db.from(Collections.VILLAGE_INFO).select('*').limit(1).maybeSingle();
  if (err_info) throw err_info;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  if (!info) return res.status(404).json({ detail: 'Village info not set up yet' });
  res.json(info);
}));

router.put('/info', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: info, error: err_info } = await db.from(Collections.VILLAGE_INFO).select('*').limit(1).maybeSingle();
  if (err_info) throw err_info;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  if (!info) return res.status(404).json({ detail: 'Village info not set up yet' });

  const updates = { ...req.body, is_demo_data: false };
  const { error: updError } = await db.from(Collections.VILLAGE_INFO).update(updates).eq('id', info.id);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  const { data: updated, error: err_updated } = await db.from(Collections.VILLAGE_INFO).select('*').eq('id', info.id).maybeSingle();
  if (err_updated) throw err_updated;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(updated);
}));

// ---------- Facilities ----------

router.get('/facilities', asyncHandler(async (req, res) => {
  const db = getDb();
  const { category } = req.query;
  const query = category ? { category } : {};
  const { data: docs, error: err_docs } = await db.from(Collections.FACILITIES).select('*').match(query).limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/facilities', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const doc = { id: newId(), ...req.body, is_demo_data: false };
  const { error: insError } = await db.from(Collections.FACILITIES).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.put('/facilities/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { data: existing, error: err_existing } = await db.from(Collections.FACILITIES).select('*').eq('id', id).maybeSingle();
  if (err_existing) throw err_existing;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  if (!existing) return res.status(404).json({ detail: 'Facility not found' });

  const updates = { ...req.body, is_demo_data: false };
  const { error: updError } = await db.from(Collections.FACILITIES).update(updates).eq('id', id);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  const { data: updated, error: err_updated } = await db.from(Collections.FACILITIES).select('*').eq('id', id).maybeSingle();
  if (err_updated) throw err_updated;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(updated);
}));

router.delete('/facilities/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.FACILITIES).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Facility not found' });
  res.json({ deleted: true });
}));

// ---------- Important contacts ----------

router.get('/contacts', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.IMPORTANT_CONTACTS).select('*').limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/contacts', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const doc = { id: newId(), ...req.body, is_demo_data: false };
  const { error: insError } = await db.from(Collections.IMPORTANT_CONTACTS).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.delete('/contacts/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.IMPORTANT_CONTACTS).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Contact not found' });
  res.json({ deleted: true });
}));

module.exports = router;
