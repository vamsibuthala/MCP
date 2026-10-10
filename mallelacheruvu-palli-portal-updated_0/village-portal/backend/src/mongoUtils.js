const { v4: uuidv4 } = require('uuid');

function newId() {
  return uuidv4();
}

/**
 * Convert a Mongo document (_id) into an API-shaped object (id), and
 * normalize Date -> 'YYYY-MM-DD' string for any field ending in _date
 * (or named taken_on), matching the FastAPI version's date-only output.
 */
function serialize(doc) {
  if (!doc) return null;
  const out = { ...doc };
  out.id = out._id;
  delete out._id;
  for (const [key, value] of Object.entries(out)) {
    if (value instanceof Date && (key.endsWith('_date') || key === 'taken_on')) {
      out[key] = value.toISOString().slice(0, 10);
    }
  }
  return out;
}

/**
 * Mongo has no native `date` type — store dates as midnight UTC Dates.
 * Accepts a 'YYYY-MM-DD' string, a Date, or null/undefined.
 */
function toDatetime(d) {
  if (d === null || d === undefined) return null;
  if (d instanceof Date) return d;
  return new Date(`${d}T00:00:00.000Z`);
}

module.exports = { newId, serialize, toDatetime };
