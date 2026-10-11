const path = require('path');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const { requireAdmin } = require('../auth');
const { upload } = require('../upload');
const { getDb } = require('../database');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: 'No image file uploaded' });
  }

  const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
  const filename = `${uuidv4()}${ext}`;
  const db = getDb();

  // Upload buffer directly to Supabase storage bucket 'portal-uploads'
  const { error: uploadErr } = await db.storage
    .from('portal-uploads')
    .upload(filename, req.file.buffer, {
      contentType: req.file.mimetype || 'image/jpeg',
      upsert: true,
    });

  if (uploadErr) {
    console.error('Storage upload error:', uploadErr);
    return res.status(500).json({ detail: uploadErr.message || 'Image storage upload failed' });
  }

  const { data: publicUrlData } = db.storage
    .from('portal-uploads')
    .getPublicUrl(filename);

  res.json({ url: publicUrlData.publicUrl });
}));

// Multer error handler
// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(400).json({ detail: err.message || 'Upload failed' });
});

module.exports = router;
