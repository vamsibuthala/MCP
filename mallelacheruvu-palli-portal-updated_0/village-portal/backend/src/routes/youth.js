const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

function decodeYouth(doc) {
  if (!doc) return doc;
  let img = doc.image_url || '';
  let desc = doc.description || '';
  const match = desc.match(/<!--IMAGE_URL:(.*?)-->/);
  if (match) {
    img = match[1].trim();
    desc = desc.replace(/<!--IMAGE_URL:.*?-->/g, '').trim();
  }
  return {
    ...doc,
    description: desc,
    image_url: img || null,
  };
}

function encodeYouthDesc(desc, imageUrl) {
  let clean = (desc || '').replace(/<!--IMAGE_URL:.*?-->/g, '').trim();
  if (imageUrl) {
    clean = clean ? `${clean}\n<!--IMAGE_URL:${imageUrl}-->` : `<!--IMAGE_URL:${imageUrl}-->`;
  }
  return clean;
}

router.get('/activities', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: docs, error: err_docs } = await db.from(Collections.YOUTH_ACTIVITIES).select('*').limit(500);
  if (err_docs) throw err_docs;
  res.json((docs || []).map(decodeYouth));
}));

router.post('/activities', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const imageUrl = req.body.image_url || null;
  const encodedDesc = encodeYouthDesc(req.body.description, imageUrl);

  const baseDoc = {
    id: newId(),
    title: req.body.title || 'Youth Activity',
    description: encodedDesc,
  };

  let { error: insError } = await db.from(Collections.YOUTH_ACTIVITIES).insert([{
    ...baseDoc,
    image_url: imageUrl,
  }]);

  if (insError && insError.code === 'PGRST204') {
    const retry = await db.from(Collections.YOUTH_ACTIVITIES).insert([baseDoc]);
    insError = retry.error;
  }

  if (insError) throw insError;
  res.status(201).json(decodeYouth({ ...baseDoc, image_url: imageUrl }));
}));

router.delete('/activities/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.YOUTH_ACTIVITIES).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  res.json({ deleted: true });
}));

module.exports = router;
