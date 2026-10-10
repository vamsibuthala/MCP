/**
 * Seed the database with demo/placeholder data so the site is browsable
 * before real village information is entered by an administrator.
 *
 * Run with:  npm run seed   (or  node src/seed.js)
 */
require('dotenv').config();

const config = require('./config');
const { connectDB, getDb } = require('./database');
const { hashPassword } = require('./auth');
const { Collections } = require('./models');
const { newId } = require('./mongoUtils');

async function run() {
  await connectDB();
  const db = getDb();
  const now = new Date();

  // --- Admin user ---
  // Upsert on role so re-running the seed always leaves exactly one admin
  // account, updated to whatever DEFAULT_ADMIN_USERNAME/PASSWORD are set to
  // (instead of silently keeping stale credentials from an earlier seed).
  await db.collection(Collections.USERS).updateOne(
    { role: 'admin' },
    {
      $set: {
        name: 'Village Admin',
        email: config.defaultAdminEmail,
        password_hash: await hashPassword(config.defaultAdminPassword),
        role: 'admin',
      },
      $setOnInsert: { _id: newId(), created_at: now },
    },
    { upsert: true }
  );

  // --- Village info (single document) ---
  if (!(await db.collection(Collections.VILLAGE_INFO).findOne({}))) {
    await db.collection(Collections.VILLAGE_INFO).insertOne({
      _id: newId(),
      title: 'Mallelacheruvu Palli',
      tagline: 'Our Village • Our People • Our Pride',
      description:
        'DEMO DATA — replace from the admin dashboard. Mallelacheruvu Palli is a ' +
        'close-knit village in Andhra Pradesh where farming, family, and festival ' +
        'keep the same rhythm they always have.',
      history: "DEMO DATA — add the village's real history here.",
      culture: 'DEMO DATA — add details about local culture and traditions here.',
      traditions: 'DEMO DATA — describe recurring festivals and customs here.',
      main_occupations: 'DEMO DATA — e.g. farming, dairy, small trade.',
      community_values: 'DEMO DATA — describe what the village stands for.',
      hero_image_url: '',
      about_image_url: '',
      population: 0,
      families: 0,
      schools: 0,
      temples: 0,
      farmers: 0,
      youth_members: 0,
      is_demo_data: true,
    });
  }

  // --- Facilities ---
  if ((await db.collection(Collections.FACILITIES).countDocuments({})) === 0) {
    const demoFacilities = [
      ['Village Primary School', 'school', 'Government primary school serving the village.'],
      ['Sri Venkateswara Temple', 'temple', 'Main village temple, site of annual festival.'],
      ['Primary Health Sub-Centre', 'health', 'Basic health checkups and first aid.'],
      ['Gram Panchayat Office', 'panchayat', 'Local self-governance office.'],
      ['Village Provision Store', 'shop', 'General store for daily essentials.'],
      ['Community Playground', 'playground', 'Open ground used for local matches.'],
      ['Village Park', 'park', 'Small green space for the community.'],
      ['Overhead Water Tank', 'water', 'Village drinking water supply point.'],
      ['Main Road Bus Stop', 'transport', 'Stop for buses to the nearest town.'],
    ];
    await db.collection(Collections.FACILITIES).insertMany(
      demoFacilities.map(([name, cat, desc]) => ({
        _id: newId(),
        name,
        category: cat,
        description: desc,
        location_details: 'DEMO DATA — add exact location',
        latitude: null,
        longitude: null,
        is_demo_data: true,
      }))
    );
  }

  // --- Crops ---
  if ((await db.collection(Collections.CROPS).countDocuments({})) === 0) {
    await db.collection(Collections.CROPS).insertMany([
      { _id: newId(), name: 'Paddy', season: 'Kharif (Jun–Nov)', description: 'DEMO DATA — main staple crop grown in the rainy season.', image_url: '', is_demo_data: true },
      { _id: newId(), name: 'Groundnut', season: 'Kharif / Rabi', description: 'DEMO DATA — widely grown oilseed crop.', image_url: '', is_demo_data: true },
      { _id: newId(), name: 'Cotton', season: 'Kharif (Jun–Dec)', description: 'DEMO DATA — cash crop grown by several farming families.', image_url: '', is_demo_data: true },
    ]);
  }

  // --- Farmer resources ---
  if ((await db.collection(Collections.FARMER_RESOURCES).countDocuments({})) === 0) {
    await db.collection(Collections.FARMER_RESOURCES).insertMany([
      { _id: newId(), title: 'Government Schemes', category: 'scheme', description: 'DEMO DATA — list of applicable state/central schemes.', link_url: '', is_demo_data: true },
      { _id: newId(), title: 'Crop Information', category: 'crop_info', description: 'DEMO DATA — sowing calendars and best practices.', link_url: '', is_demo_data: true },
      { _id: newId(), title: 'Weather Information', category: 'weather', description: 'DEMO DATA — link to local weather forecast.', link_url: '', is_demo_data: true },
      { _id: newId(), title: 'Market Prices', category: 'market', description: 'DEMO DATA — nearest mandi price information.', link_url: '', is_demo_data: true },
      { _id: newId(), title: 'Agricultural Contacts', category: 'contact', description: 'DEMO DATA — extension officer contact details.', link_url: '', is_demo_data: true },
    ]);
  }

  // --- Events ---
  if ((await db.collection(Collections.EVENTS).countDocuments({})) === 0) {
    const today = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    const midnightUtc = (d) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const events = [
      ['Sankranti Celebrations', 'festival', 'upcoming', 20, 'Village Center', 'DEMO DATA — annual harvest festival celebration.'],
      ['Village Volleyball Tournament', 'sports', 'upcoming', 35, 'Community Playground', 'DEMO DATA — inter-team sports tournament.'],
      ['Gram Sabha Meeting', 'meeting', 'upcoming', 10, 'Panchayat Office', 'DEMO DATA — open village council meeting.'],
      ['Youth Blood Donation Camp', 'youth', 'completed', -15, 'Village School Grounds', 'DEMO DATA — organized by Mallelacheruvu Palli Youth.'],
      ['Ugadi Cultural Program', 'cultural', 'completed', -60, 'Sri Venkateswara Temple', 'DEMO DATA — cultural performances for New Year.'],
    ];
    await db.collection(Collections.EVENTS).insertMany(
      events.map(([title, cat, status, delta, loc, desc]) => ({
        _id: newId(),
        title,
        category: cat,
        status,
        event_date: new Date(midnightUtc(today).getTime() + delta * dayMs),
        event_time: '6:00 PM',
        location: loc,
        description: desc,
        image_url: '',
        created_at: now,
      }))
    );
  }

  // --- Announcements ---
  if ((await db.collection(Collections.ANNOUNCEMENTS).countDocuments({})) === 0) {
    const announcements = [
      ['Water Supply Maintenance Notice', 'general', 'DEMO DATA — scheduled maintenance may affect supply timing.'],
      ['New Crop Insurance Scheme Open', 'schemes', 'DEMO DATA — farmers can apply at the panchayat office.'],
      ['School Admissions Open', 'education', 'DEMO DATA — admissions for the new academic year are open.'],
    ];
    await db.collection(Collections.ANNOUNCEMENTS).insertMany(
      announcements.map(([title, cat, short]) => ({
        _id: newId(),
        title,
        category: cat,
        short_description: short,
        full_content: `${short} Full details to be added by admin.`,
        is_published: true,
        created_at: now,
      }))
    );
  }

  // --- Services ---
  if ((await db.collection(Collections.SERVICES).countDocuments({})) === 0) {
    const services = [
      ['Lakshmi General Store', 'grocery', 'DEMO DATA — daily groceries and essentials.', '0000000000'],
      ['Village Medical Store', 'medical', 'DEMO DATA — basic medicines.', '0000000000'],
      ['Ramesh Auto Works', 'mechanic', 'DEMO DATA — two-wheeler and tractor repairs.', '0000000000'],
    ];
    await db.collection(Collections.SERVICES).insertMany(
      services.map(([name, cat, desc, phone]) => ({
        _id: newId(),
        name,
        category: cat,
        description: desc,
        phone,
        location: 'DEMO DATA',
        timings: '9 AM – 8 PM',
        is_demo_data: true,
        created_at: now,
      }))
    );
  }

  // --- Important contacts ---
  if ((await db.collection(Collections.IMPORTANT_CONTACTS).countDocuments({})) === 0) {
    const contacts = [
      ['Gram Panchayat Office', 'panchayat', '0000000000'],
      ['Village Primary School', 'schools', '0000000000'],
      ['Primary Health Sub-Centre', 'health', '0000000000'],
      ['Nearest Police Station', 'police', '100'],
      ['Fire Services', 'fire', '101'],
      ['Ambulance', 'emergency', '108'],
    ];
    await db.collection(Collections.IMPORTANT_CONTACTS).insertMany(
      contacts.map(([name, cat, phone]) => ({
        _id: newId(),
        name,
        category: cat,
        phone,
        notes: 'DEMO DATA — confirm and update',
        is_demo_data: true,
      }))
    );
  }

  // --- Youth activities ---
  if ((await db.collection(Collections.YOUTH_ACTIVITIES).countDocuments({})) === 0) {
    const activities = [
      ['Village Cleaning Drive', 'DEMO DATA — monthly cleanliness drive led by village youth.'],
      ['Blood Donation Camp', 'DEMO DATA — organized in partnership with the health centre.'],
      ['Festival Arrangements', 'DEMO DATA — youth team coordinating festival setup.'],
    ];
    await db.collection(Collections.YOUTH_ACTIVITIES).insertMany(
      activities.map(([title, desc]) => ({
        _id: newId(),
        title,
        description: desc,
        image_url: '',
        activity_date: null,
        is_demo_data: true,
      }))
    );
  }

  // --- People (notable villagers directory) ---
  if ((await db.collection(Collections.PEOPLE).countDocuments({})) === 0) {
    const people = [
      ['Village Sarpanch', 'Sarpanch', 'DEMO DATA — elected head of the Gram Panchayat.'],
      ['Ward Member', 'Ward Member', 'DEMO DATA — represents the local ward.'],
      ['Senior Teacher', 'Teacher', 'DEMO DATA — long-serving teacher at the village school.'],
    ];
    await db.collection(Collections.PEOPLE).insertMany(
      people.map(([name, role, bio], i) => ({
        _id: newId(),
        name,
        role,
        bio,
        photo_url: '',
        display_order: i,
        is_demo_data: true,
        created_at: now,
      }))
    );
  }

  console.log('Seed complete.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
