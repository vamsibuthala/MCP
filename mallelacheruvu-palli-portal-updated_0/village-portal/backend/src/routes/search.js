const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const q = req.query.q || '';
  const rx = { $regex: q, $options: 'i' };

  const [events, announcements, services, facilities, gallery, people] = await Promise.all([
    db.collection(Collections.EVENTS).find({ title: rx }).limit(10).toArray(),
    db.collection(Collections.ANNOUNCEMENTS).find({ title: rx, is_published: true }).limit(10).toArray(),
    db.collection(Collections.SERVICES).find({ name: rx }).limit(10).toArray(),
    db.collection(Collections.FACILITIES).find({ name: rx }).limit(10).toArray(),
    db.collection(Collections.GALLERY_ITEMS).find({ title: rx }).limit(10).toArray(),
    db.collection(Collections.PEOPLE).find({ name: rx }).limit(10).toArray(),
  ]);

  res.json({
    events: events.map((e) => ({ id: e._id, title: e.title, type: 'event' })),
    announcements: announcements.map((a) => ({ id: a._id, title: a.title, type: 'announcement' })),
    services: services.map((s) => ({ id: s._id, title: s.name, type: 'service' })),
    facilities: facilities.map((f) => ({ id: f._id, title: f.name, type: 'facility' })),
    gallery: gallery.map((g) => ({ id: g._id, title: g.title || '', type: 'gallery' })),
    people: people.map((p) => ({ id: p._id, title: p.name, type: 'person' })),
  });
}));

module.exports = router;
