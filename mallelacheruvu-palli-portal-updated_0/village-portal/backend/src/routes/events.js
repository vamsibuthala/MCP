const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId, toDatetime } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

function decodeEvent(doc) {
  if (!doc) return doc;
  let images = Array.isArray(doc.images) ? doc.images : [];
  let desc = doc.description || '';
  const match = desc.match(/<!--IMAGES:(.*?)-->/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        images = parsed;
      }
    } catch (e) {}
    desc = desc.replace(/<!--IMAGES:.*?-->/g, '').trim();
  } else if (doc.image_url && images.length === 0) {
    images = [doc.image_url];
  }
  return {
    ...doc,
    description: desc,
    images,
    image_url: doc.image_url || images[0] || null,
  };
}

function prepareEventData(body) {
  let images = [];
  if (Array.isArray(body.images)) {
    images = body.images.filter(Boolean);
  } else if (body.image_url) {
    images = [body.image_url];
  }
  const primaryImg = body.image_url || images[0] || null;
  let rawDesc = (body.description || '').trim();
  rawDesc = rawDesc.replace(/<!--IMAGES:.*?-->/g, '').trim();
  let encodedDesc = rawDesc;
  if (images.length > 0) {
    encodedDesc = rawDesc ? `${rawDesc}\n<!--IMAGES:${JSON.stringify(images)}-->` : `<!--IMAGES:${JSON.stringify(images)}-->`;
  }
  return { images, primaryImg, encodedDesc };
}

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const { category, status } = req.query;
  const query = {};
  if (category && category !== 'all') query.category = category;
  if (status && status !== 'all') query.status = status;

  const { data: docs, error: err_docs } = await db.from(Collections.EVENTS).select('*').match(query).order('event_date', { ascending: false }).limit(500);
  if (err_docs) throw err_docs;
  res.json((docs || []).map(decodeEvent));
}));

router.get('/latest', asyncHandler(async (req, res) => {
  const db = getDb();
  const limit = parseInt(req.query.limit || '3', 10);

  const { data: docs, error: err_docs } = await db.from(Collections.EVENTS).select('*').match({ status: 'upcoming' }).order('event_date', { ascending: true }).limit(limit);
  if (err_docs) throw err_docs;
  res.json((docs || []).map(decodeEvent));
}));

router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { images, primaryImg, encodedDesc } = prepareEventData(req.body);
  const event_date = req.body.event_date ? toDatetime(req.body.event_date) : null;

  const baseDoc = {
    id: newId(),
    title: req.body.title || 'Untitled Event',
    category: req.body.category || 'festival',
    event_date,
    location: req.body.location || '',
    status: req.body.status || 'upcoming',
    description: encodedDesc,
    created_at: new Date().toISOString(),
  };

  // Try insert with image_url / images columns first
  let { error: insError } = await db.from(Collections.EVENTS).insert([{
    ...baseDoc,
    image_url: primaryImg,
    images: images,
  }]);

  if (insError && insError.code === 'PGRST204') {
    // Retry without images column if PGRST204
    const retry1 = await db.from(Collections.EVENTS).insert([{
      ...baseDoc,
      image_url: primaryImg,
    }]);
    insError = retry1.error;

    if (insError && insError.code === 'PGRST204') {
      // Retry with baseDoc (photos safely encoded inside description)
      const retry2 = await db.from(Collections.EVENTS).insert([baseDoc]);
      insError = retry2.error;
    }
  }

  if (insError) throw insError;
  res.status(201).json(decodeEvent(baseDoc));
}));

router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { data: existing, error: err_existing } = await db.from(Collections.EVENTS).select('*').eq('id', id).maybeSingle();
  if (err_existing) throw err_existing;
  if (!existing) return res.status(404).json({ detail: 'Event not found' });

  const { images, primaryImg, encodedDesc } = prepareEventData(req.body);
  const updates = {};
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.category !== undefined) updates.category = req.body.category;
  if (req.body.event_date !== undefined) updates.event_date = toDatetime(req.body.event_date);
  if (req.body.location !== undefined) updates.location = req.body.location;
  if (req.body.status !== undefined) updates.status = req.body.status;
  if (req.body.description !== undefined || req.body.images !== undefined || req.body.image_url !== undefined) {
    updates.description = encodedDesc;
  }

  let { error: updErr } = await db.from(Collections.EVENTS).update({
    ...updates,
    image_url: primaryImg,
    images: images,
  }).eq('id', id);

  if (updErr && updErr.code === 'PGRST204') {
    const retry1 = await db.from(Collections.EVENTS).update({
      ...updates,
      image_url: primaryImg,
    }).eq('id', id);
    updErr = retry1.error;

    if (updErr && updErr.code === 'PGRST204') {
      const retry2 = await db.from(Collections.EVENTS).update(updates).eq('id', id);
      updErr = retry2.error;
    }
  }

  if (updErr) throw updErr;

  const { data: updated, error: err_updated } = await db.from(Collections.EVENTS).select('*').eq('id', id).maybeSingle();
  if (err_updated) throw err_updated;
  res.json(decodeEvent(updated));
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { error: resultError } = await db.from(Collections.EVENTS).delete().eq('id', req.params.id);
  if (resultError) throw resultError;
  res.json({ deleted: true });
}));

module.exports = router;
