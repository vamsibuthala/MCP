const express = require('express');

const { getDb } = require('../database');
const { Collections } = require('../models');
const { requireAdmin } = require('../auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/dashboard', requireAdmin, asyncHandler(async (req, res) => {
  const db = getDb();

  const [
    total_announcements,
    total_events,
    gallery_images,
    total_services,
    pending_feedback,
    pending_memories,
    total_people,
  ] = await Promise.all([
    db.from(Collections.ANNOUNCEMENTS).select('*', { count: 'exact', head: true }).match({}).then(({count}) => count),
    db.from(Collections.EVENTS).select('*', { count: 'exact', head: true }).match({}).then(({count}) => count),
    db.from(Collections.GALLERY_ITEMS).select('*', { count: 'exact', head: true }).match({}).then(({count}) => count),
    db.from(Collections.SERVICES).select('*', { count: 'exact', head: true }).match({}).then(({count}) => count),
    db.from(Collections.FEEDBACK).select('*', { count: 'exact', head: true }).match({ status: 'new' }).then(({count}) => count),
    db.from(Collections.MEMORIES).select('*', { count: 'exact', head: true }).match({ status: 'pending' }).then(({count}) => count),
    db.from(Collections.PEOPLE).select('*', { count: 'exact', head: true }).match({}).then(({count}) => count),
  ]);

  res.json({
    total_announcements,
    total_events,
    gallery_images,
    total_services,
    pending_feedback,
    pending_memories,
    total_people,
  });
}));

module.exports = router;
