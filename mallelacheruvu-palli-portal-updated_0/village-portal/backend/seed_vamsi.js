require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function seedUser() {
  const password_hash = await bcrypt.hash('VAMSI REDDY', 10);
  
  await supabase.from('users').delete().eq('email', 'VAMSI REDDY');

  const { data, error } = await supabase.from('users').insert([{
    id: uuidv4(),
    email: 'VAMSI REDDY',
    password: password_hash,
    name: 'Vamsi Reddy',
    role: 'admin'
  }]);

  console.log(error || "User VAMSI REDDY seeded!");
}
seedUser();
