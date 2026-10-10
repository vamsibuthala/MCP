const express = require('express');

const { requireAdmin } = require('../auth');
const { upload, fileUrl } = require('../upload');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ detail: 'No image file uploaded' });
  res.json({ url: fileUrl(req, req.file.filename) });
}));

// Multer errors (bad file type, too large) come through next(err) — catch them
// here so the response is a clean 400 instead of the generic 500 handler.
// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(400).json({ detail: err.message || 'Upload failed' });
});

module.exports = router;
