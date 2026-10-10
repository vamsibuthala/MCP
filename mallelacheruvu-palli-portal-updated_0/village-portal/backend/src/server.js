require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const config = require('./config');
const { connectDB } = require('./database');
const { UPLOAD_DIR } = require('./upload');

const authRoutes = require('./routes/auth');
const villageRoutes = require('./routes/village');
const agricultureRoutes = require('./routes/agriculture');
const eventsRoutes = require('./routes/events');
const announcementsRoutes = require('./routes/announcements');
const servicesRoutes = require('./routes/services');
const galleryRoutes = require('./routes/gallery');
const memoriesRoutes = require('./routes/memories');
const feedbackRoutes = require('./routes/feedback');
const youthRoutes = require('./routes/youth');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const peopleRoutes = require('./routes/people');
const uploadRoutes = require('./routes/upload');

async function start() {
  await connectDB();

  const app = express();
  app.use(express.json());
  app.use(cors({ origin: config.frontendOrigin, credentials: true }));

  // Serves uploaded gallery/people photos (see backend/src/upload.js)
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'mallelacheruvu-palli-portal-api' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/village', villageRoutes);
  app.use('/api/agriculture', agricultureRoutes);
  app.use('/api/events', eventsRoutes);
  app.use('/api/announcements', announcementsRoutes);
  app.use('/api/services', servicesRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/memories', memoriesRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/youth', youthRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/people', peopleRoutes);
  app.use('/api/upload', uploadRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ detail: 'Not found' });
  });

  // Central error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ detail: err.message || 'Internal server error' });
  });

  app.listen(config.port, () => {
    console.log(`Mallelacheruvu Palli Portal API listening on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
