const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// ---------- Crops ----------

router.get('/crops', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.CROPS).select('*').limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/crops', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const doc = { id: newId(), ...req.body, is_demo_data: false };
  const { error: insError } = await db.from(Collections.CROPS).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.delete('/crops/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.CROPS).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Crop not found' });
  res.json({ deleted: true });
}));

// ---------- Farmer resources ----------

router.get('/resources', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.FARMER_RESOURCES).select('*').limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/resources', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const doc = { id: newId(), ...req.body, is_demo_data: false };
  const { error: insError } = await db.from(Collections.FARMER_RESOURCES).insert([doc]);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(doc);
}));

router.delete('/resources/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.FARMER_RESOURCES).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Resource not found' });
  res.json({ deleted: true });
}));

module.exports = router;
