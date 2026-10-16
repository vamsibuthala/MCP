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

  // Try ordering by uploaded_at (actual Supabase column), fallback to without order if needed
  let { data: docs, error: err_docs } = await db.from(Collections.GALLERY_ITEMS).select('*').match(query).order('uploaded_at', { ascending: false }).limit(500);
  if (err_docs && err_docs.code === 'PGRST204') {
    const fallback = await db.from(Collections.GALLERY_ITEMS).select('*').match(query).limit(500);
    docs = fallback.data;
    err_docs = fallback.error;
  }
  if (err_docs) throw err_docs;
  res.json(docs || []);
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const now = new Date().toISOString();

  // If frontend sends multiple images: { images: ['url1', 'url2'], title, category }
  if (Array.isArray(req.body.images) && req.body.images.length > 0) {
    const docs = req.body.images.map((url) => ({
      id: newId(),
      title: req.body.title || '',
      category: req.body.category || 'general',
      image_url: url,
      uploaded_at: now,
    }));
    const { error: batchErr } = await db.from(Collections.GALLERY_ITEMS).insert(docs);
    if (batchErr) throw batchErr;
    return res.status(201).json(docs);
  }

  const doc = {
    id: newId(),
    title: req.body.title || '',
    category: req.body.category || 'general',
    image_url: req.body.image_url,
    uploaded_at: now,
  };
  const { error: insError } = await db.from(Collections.GALLERY_ITEMS).insert([doc]);
  if (insError) throw insError;
  res.status(201).json(doc);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.GALLERY_ITEMS).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  res.json({ deleted: true });
}));

module.exports = router;
