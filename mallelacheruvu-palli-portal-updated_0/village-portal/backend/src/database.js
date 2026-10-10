const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

let supabase;

async function connectDB() {
  if (!config.supabaseUrl || !config.supabaseKey || config.supabaseUrl === 'https://your-project-ref.supabase.co') {
    console.warn('WARNING: Supabase URL or Key is not configured correctly. Database queries will fail.');
  }
  supabase = createClient(config.supabaseUrl, config.supabaseKey);
  console.log('Connected to Supabase');
  return supabase;
}

function getDb() {
  if (!supabase) {
    throw new Error('Database not initialized — call connectDB() first');
  }
  return supabase;
}

module.exports = { connectDB, getDb };
