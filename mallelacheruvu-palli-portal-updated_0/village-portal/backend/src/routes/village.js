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
  if (!info) {
    return res.json({
      title: 'Mallelacheruvu Palli',
      tagline: 'Our Village, Our People, Our Pride',
      description: 'Mallelacheruvu Palli is a vibrant, peaceful village rooted in agriculture, rich culture, and community spirit.',
      history: 'Founded centuries ago, our village has prospered through fertile lands, traditional values, and hardworking families.',
      culture: 'Traditional Andhra culture with active celebration of Sankranti, Ugadi, and local temple jatras.',
      traditions: 'Farming customs, harvest celebrations, and deep community cooperation.',
      main_occupations: 'Agriculture (Paddy, Chillies, Cotton), Dairy Farming, and Local Crafts.',
      community_values: 'Harmony, mutual assistance, education for children, and respect for elders.',
      hero_image_url: '',
      about_image_url: '',
      population: 1850,
      families: 420,
      schools: 2,
      temples: 3,
      farmers: 310,
      youth_members: 145,
      is_demo_data: true,
    });
  }
  res.json(info);
}));

router.put('/info', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: info, error: err_info } = await db.from(Collections.VILLAGE_INFO).select('*').limit(1).maybeSingle();
  if (err_info) throw err_info;

  const { id: _ignoreId, ...rest } = req.body;
  const updates = { ...rest, is_demo_data: false };

  if (!info) {
    const doc = { id: newId(), ...updates };
    const { error: insErr } = await db.from(Collections.VILLAGE_INFO).insert([doc]);
    if (insErr) throw insErr;
    return res.json(doc);
  }

  const { error: updErr } = await db.from(Collections.VILLAGE_INFO).update(updates).eq('id', info.id);
  if (updErr) throw updErr;

  const { data: updated, error: err_updated } = await db.from(Collections.VILLAGE_INFO).select('*').eq('id', info.id).maybeSingle();
  if (err_updated) throw err_updated;
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
  let { error: insError } = await db.from(Collections.FACILITIES).insert([doc]);
  if (insError && insError.code === 'PGRST204' && doc.image_url) {
    const { image_url, ...withoutImg } = doc;
    const retry = await db.from(Collections.FACILITIES).insert([withoutImg]);
    insError = retry.error;
  }
  if (insError) throw insError;
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
