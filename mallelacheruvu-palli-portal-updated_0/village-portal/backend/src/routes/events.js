const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId, toDatetime } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const { category, status } = req.query;
  const query = {};
  if (category && category !== 'all') query.category = category;
  if (status && status !== 'all') query.status = status;

  const { data: docs, error: err_docs } = await db.from(Collections.EVENTS).select('*').match(query).order('event_date', { ascending: false }).limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.get('/latest', asyncHandler(async (req, res) => {
  const db = getDb();
  const limit = parseInt(req.query.limit || '3', 10);

  const { data: docs, error: err_docs } = await db.from(Collections.EVENTS).select('*').match({ status: 'upcoming' }).order('event_date', { ascending: true });
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const data = { ...req.body, event_date: toDatetime(req.body.event_date) };
  const doc = { id: newId(), ...data, created_at: new Date() };
  let { error: insError } = await db.from(Collections.EVENTS).insert([doc]);
  if (insError && insError.code === 'PGRST204' && doc.image_url) {
    const { image_url, ...withoutImg } = doc;
    const retry = await db.from(Collections.EVENTS).insert([withoutImg]);
    insError = retry.error;
  }
  if (insError) throw insError;
  res.json(doc);
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { data: existing, error: err_existing } = await db.from(Collections.EVENTS).select('*').eq('id', id).maybeSingle();
  if (err_existing) throw err_existing;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  if (!existing) return res.status(404).json({ detail: 'Event not found' });

  const updates = { ...req.body };
  if (updates.event_date !== undefined) updates.event_date = toDatetime(updates.event_date);
  const { error: updError } = await db.from(Collections.EVENTS).update(updates).eq('id', id);
  if (typeof error !== 'undefined' && error) throw error;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  const { data: updated, error: err_updated } = await db.from(Collections.EVENTS).select('*').eq('id', id).maybeSingle();
  if (err_updated) throw err_updated;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(updated);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.EVENTS).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Event not found' });
  res.json({ deleted: true });
}));

module.exports = router;
