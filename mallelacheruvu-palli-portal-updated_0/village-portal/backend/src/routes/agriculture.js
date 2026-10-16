const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

function decodeCrop(doc) {
  if (!doc) return doc;
  let img = doc.image_url || '';
  let notes = doc.notes || '';
  const match = notes.match(/<!--IMAGE_URL:(.*?)-->/);
  if (match) {
    img = match[1].trim();
    notes = notes.replace(/<!--IMAGE_URL:.*?-->/g, '').trim();
  } else if (notes.includes('[IMAGE_URL]:')) {
    const parts = notes.split('[IMAGE_URL]:');
    notes = parts[0].trim();
    img = parts[1].trim();
  }
  return {
    ...doc,
    notes,
    image_url: img || null,
  };
}

function encodeCropNotes(notes, imageUrl) {
  let clean = (notes || '').replace(/<!--IMAGE_URL:.*?-->/g, '').replace(/\[IMAGE_URL\]:.*?$/gm, '').trim();
  if (imageUrl) {
    clean = clean ? `${clean}\n<!--IMAGE_URL:${imageUrl}-->` : `<!--IMAGE_URL:${imageUrl}-->`;
  }
  return clean;
}

// ---------- Crops ----------

router.get('/crops', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.CROPS).select('*').limit(500);
  if (err_docs) throw err_docs;
  res.json((docs || []).map(decodeCrop));
}));

router.post('/crops', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const imageUrl = req.body.image_url || null;
  const encodedNotes = encodeCropNotes(req.body.notes, imageUrl);

  const baseDoc = {
    id: newId(),
    name: req.body.name,
    season: req.body.season || '',
    notes: encodedNotes,
  };

  // First try inserting with image_url column
  let { error: insError } = await db.from(Collections.CROPS).insert([{
    ...baseDoc,
    image_url: imageUrl,
  }]);

  if (insError && insError.code === 'PGRST204') {
    // Retry with baseDoc (image is safely stored in notes metadata)
    const retry = await db.from(Collections.CROPS).insert([baseDoc]);
    insError = retry.error;
  }

  if (insError) throw insError;
  res.status(201).json(decodeCrop({ ...baseDoc, image_url: imageUrl }));
}));

router.delete('/crops/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.CROPS).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
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
