const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/activities', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.YOUTH_ACTIVITIES).select('*').limit(500);
  if (err_docs) throw err_docs;
  if (typeof updError !== 'undefined' && updError) throw updError;
  if (typeof insError !== 'undefined' && insError) throw insError;
  res.json(docs);
}));

router.post('/activities', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const doc = { id: newId(), ...req.body, is_demo_data: false };
  let { error: insError } = await db.from(Collections.YOUTH_ACTIVITIES).insert([doc]);
  if (insError && insError.code === 'PGRST204' && doc.image_url) {
    const { image_url, ...withoutImg } = doc;
    const retry = await db.from(Collections.YOUTH_ACTIVITIES).insert([withoutImg]);
    insError = retry.error;
  }
  if (insError) throw insError;
  res.json(doc);
}));

router.delete('/activities/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.YOUTH_ACTIVITIES).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  const result = { deletedCount: 1 };
  if (result.deletedCount === 0) return res.status(404).json({ detail: 'Activity not found' });
  res.json({ deleted: true });
}));

module.exports = router;
