-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  name TEXT
);

-- VILLAGE_INFO Table
CREATE TABLE village_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  tagline TEXT,
  description TEXT,
  history TEXT,
  culture TEXT,
  traditions TEXT,
  main_occupations TEXT,
  community_values TEXT,
  hero_image_url TEXT,
  about_image_url TEXT,
  population INTEGER,
  families INTEGER,
  schools INTEGER,
  temples INTEGER,
  farmers INTEGER,
  youth_members INTEGER,
  is_demo_data BOOLEAN DEFAULT false
);

-- FACILITIES Table
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  is_demo_data BOOLEAN DEFAULT false
);

-- CROPS Table
CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  season TEXT,
  notes TEXT
);

-- FARMER_RESOURCES Table
CREATE TABLE farmer_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  link TEXT
);

-- EVENTS Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT,
  event_date DATE,
  location TEXT,
  status TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANNOUNCEMENTS Table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT,
  content TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SERVICES Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  contact_phone TEXT,
  description TEXT
);

-- GALLERY_ITEMS Table
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  category TEXT,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MEMORIES Table
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  author_name TEXT,
  taken_on DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FEEDBACK Table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  contact TEXT,
  category TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMPORTANT_CONTACTS Table
CREATE TABLE important_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  is_demo_data BOOLEAN DEFAULT false
);

-- YOUTH_ACTIVITIES Table
CREATE TABLE youth_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT
);

-- PEOPLE Table
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  bio TEXT
);
