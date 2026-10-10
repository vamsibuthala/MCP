/**
 * MongoDB collection names and the category/status vocabularies used for
 * validation and seeding. MongoDB itself is schemaless — these are just the
 * shared constants routes and the seed script all reference.
 */

const Collections = {
  USERS: 'users',
  VILLAGE_INFO: 'village_info',
  FACILITIES: 'facilities',
  CROPS: 'crops',
  FARMER_RESOURCES: 'farmer_resources',
  EVENTS: 'events',
  ANNOUNCEMENTS: 'announcements',
  SERVICES: 'services',
  GALLERY_ITEMS: 'gallery_items',
  MEMORIES: 'memories',
  FEEDBACK: 'feedback',
  IMPORTANT_CONTACTS: 'important_contacts',
  YOUTH_ACTIVITIES: 'youth_activities',
  PEOPLE: 'people',
};

const FACILITY_CATEGORIES = ['school', 'temple', 'health', 'panchayat', 'shop', 'playground', 'park', 'water', 'transport'];
const EVENT_CATEGORIES = ['festival', 'sports', 'cultural', 'youth', 'community', 'meeting'];
const EVENT_STATUSES = ['upcoming', 'completed'];
const ANNOUNCEMENT_CATEGORIES = ['panchayat', 'education', 'agriculture', 'events', 'schemes', 'emergency', 'general'];
const SERVICE_CATEGORIES = ['grocery', 'medical', 'mechanic', 'electrician', 'plumber', 'tailor', 'restaurant', 'transport', 'agriculture', 'other'];
const GALLERY_CATEGORIES = ['village', 'nature', 'festivals', 'agriculture', 'youth', 'sports', 'temples', 'old_memories'];
const MEMORY_STATUSES = ['pending', 'approved', 'rejected'];
const FEEDBACK_CATEGORIES = ['suggestion', 'complaint', 'development', 'website', 'other'];
const FEEDBACK_STATUSES = ['new', 'reviewed'];
const USER_ROLES = ['admin', 'editor'];
const PEOPLE_ROLES = ['Sarpanch', 'Ward Member', 'Panchayat Secretary', 'Teacher', 'Farmer Leader', 'Youth Leader', 'Elder', 'Notable Villager', 'Other'];

module.exports = {
  Collections,
  FACILITY_CATEGORIES,
  EVENT_CATEGORIES,
  EVENT_STATUSES,
  ANNOUNCEMENT_CATEGORIES,
  SERVICE_CATEGORIES,
  GALLERY_CATEGORIES,
  MEMORY_STATUSES,
  FEEDBACK_CATEGORIES,
  FEEDBACK_STATUSES,
  USER_ROLES,
  PEOPLE_ROLES,
};
