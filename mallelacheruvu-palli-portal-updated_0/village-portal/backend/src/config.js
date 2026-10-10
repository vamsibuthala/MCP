require('dotenv').config();

const config = {
  supabaseUrl: process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co',
  supabaseKey: process.env.SUPABASE_KEY || 'your-supabase-service-role-key',
  secretKey: process.env.SECRET_KEY || 'dev-only-secret-change-me',
  accessTokenExpireMinutes: parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '120', 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  defaultAdminEmail: process.env.DEFAULT_ADMIN_USERNAME || process.env.DEFAULT_ADMIN_EMAIL || 'VAMSI REDDY',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'VAMSI REDDY',
  port: parseInt(process.env.PORT || '8000', 10),
};

module.exports = config;
