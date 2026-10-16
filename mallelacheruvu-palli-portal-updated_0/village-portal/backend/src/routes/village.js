const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const { newId } = require('../mongoUtils');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

function decodeVillageInfo(info) {
  if (!info) return info;
  let communityValues = info.community_values || '';
  let locationAddress = 'Mallelacheruvu Palli, Andhra Pradesh, India';
  let mapEmbedUrl = 'https://maps.google.com/maps?q=Mallelacheruvu+Palli,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed';
  let directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Mallelacheruvu+Palli,+Andhra+Pradesh';

  const match = communityValues.match(/<!--MAP_CONFIG:(.*?)-->/);
  if (match) {
    try {
      const cfg = JSON.parse(match[1]);
      if (cfg.location_address) locationAddress = cfg.location_address;
      if (cfg.map_embed_url) mapEmbedUrl = cfg.map_embed_url;
      if (cfg.directions_url) directionsUrl = cfg.directions_url;
    } catch (e) {}
    communityValues = communityValues.replace(/<!--MAP_CONFIG:.*?-->/g, '').trim();
  }

  return {
    ...info,
    community_values: communityValues,
    location_address: locationAddress,
    map_embed_url: mapEmbedUrl,
    directions_url: directionsUrl,
  };
}

function encodeMapConfig(communityValues, { location_address, map_embed_url, directions_url }) {
  let clean = (communityValues || '').replace(/<!--MAP_CONFIG:.*?-->/g, '').trim();
  const cfg = {
    location_address: location_address || 'Mallelacheruvu Palli, Andhra Pradesh, India',
    map_embed_url: mapEmbedUrl || 'https://maps.google.com/maps?q=Mallelacheruvu+Palli,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed',
    directions_url: directions_url || 'https://www.google.com/maps/dir/?api=1&destination=Mallelacheruvu+Palli,+Andhra+Pradesh',
  };
  return clean ? `${clean}\n<!--MAP_CONFIG:${JSON.stringify(cfg)}-->` : `<!--MAP_CONFIG:${JSON.stringify(cfg)}-->`;
}

function decodeFacility(doc) {
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

function encodeFacilityDesc(desc, imageUrl) {
  let clean = (desc || '').replace(/<!--IMAGE_URL:.*?-->/g, '').trim();
  if (imageUrl) {
    clean = clean ? `${clean}\n<!--IMAGE_URL:${imageUrl}-->` : `<!--IMAGE_URL:${imageUrl}-->`;
  }
  return clean;
}

// ---------- Village info (single document) ----------

router.get('/info', asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: info, error: err_info } = await db.from(Collections.VILLAGE_INFO).select('*').limit(1).maybeSingle();
  if (err_info) throw err_info;
  if (!info) {
    return res.json(decodeVillageInfo({
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
    }));
  }
  res.json(decodeVillageInfo(info));
}));

router.put('/info', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { data: info, error: err_info } = await db.from(Collections.VILLAGE_INFO).select('*').limit(1).maybeSingle();
  if (err_info) throw err_info;

  const allowedKeys = [
    'title', 'tagline', 'description', 'history', 'culture',
    'traditions', 'main_occupations', 'community_values',
    'hero_image_url', 'about_image_url',
    'population', 'families', 'schools', 'temples', 'farmers', 'youth_members',
  ];
  const updates = { is_demo_data: false };
  for (const key of allowedKeys) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  // Handle location and map settings
  const hasMapUpdates = req.body.location_address !== undefined || req.body.map_embed_url !== undefined || req.body.directions_url !== undefined;
  if (hasMapUpdates) {
    const currentCommValues = updates.community_values !== undefined ? updates.community_values : (info?.community_values || '');
    updates.community_values = encodeMapConfig(currentCommValues, {
      location_address: req.body.location_address,
      map_embed_url: req.body.map_embed_url,
      directions_url: req.body.directions_url,
    });
  }

  if (!info) {
    const doc = { id: newId(), ...updates };
    const { error: insErr } = await db.from(Collections.VILLAGE_INFO).insert([doc]);
    if (insErr) throw insErr;
    return res.json(decodeVillageInfo(doc));
  }

  const { error: updErr } = await db.from(Collections.VILLAGE_INFO).update(updates).eq('id', info.id);
  if (updErr) throw updErr;

  const { data: updated, error: err_updated } = await db.from(Collections.VILLAGE_INFO).select('*').eq('id', info.id).maybeSingle();
  if (err_updated) throw err_updated;
  res.json(decodeVillageInfo(updated));
}));

// ---------- Facilities ----------

router.get('/facilities', asyncHandler(async (req, res) => {
  const db = getDb();
  const { category } = req.query;
  const query = category ? { category } : {};
  const { data: docs, error: err_docs } = await db.from(Collections.FACILITIES).select('*').match(query).limit(500);
  if (err_docs) throw err_docs;
  res.json((docs || []).map(decodeFacility));
}));

router.post('/facilities', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const imageUrl = req.body.image_url || null;
  const encodedDesc = encodeFacilityDesc(req.body.description, imageUrl);

  const baseDoc = {
    id: newId(),
    name: req.body.name,
    category: req.body.category || 'other',
    description: encodedDesc,
    is_demo_data: false,
  };

  let { error: insError } = await db.from(Collections.FACILITIES).insert([{
    ...baseDoc,
    image_url: imageUrl,
  }]);

  if (insError && insError.code === 'PGRST204') {
    const retry = await db.from(Collections.FACILITIES).insert([baseDoc]);
    insError = retry.error;
  }

  if (insError) throw insError;
  res.status(201).json(decodeFacility({ ...baseDoc, image_url: imageUrl }));
}));

router.put('/facilities/:id', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { data: existing, error: err_existing } = await db.from(Collections.FACILITIES).select('*').eq('id', id).maybeSingle();
  if (err_existing) throw err_existing;
  if (!existing) return res.status(404).json({ detail: 'Facility not found' });

  const imageUrl = req.body.image_url !== undefined ? req.body.image_url : null;
  const encodedDesc = encodeFacilityDesc(req.body.description !== undefined ? req.body.description : existing.description, imageUrl);

  const updates = { is_demo_data: false };
  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.category !== undefined) updates.category = req.body.category;
  if (req.body.description !== undefined || imageUrl !== null) updates.description = encodedDesc;

  let { error: updErr } = await db.from(Collections.FACILITIES).update({
    ...updates,
    image_url: imageUrl,
  }).eq('id', id);

  if (updErr && updErr.code === 'PGRST204') {
    const retry = await db.from(Collections.FACILITIES).update(updates).eq('id', id);
    updErr = retry.error;
  }

  if (updErr) throw updErr;
  const { data: updated, error: err_updated } = await db.from(Collections.FACILITIES).select('*').eq('id', id).maybeSingle();
  if (err_updated) throw err_updated;
  res.json(decodeFacility(updated));
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
