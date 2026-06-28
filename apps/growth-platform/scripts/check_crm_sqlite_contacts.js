const Database = require('better-sqlite3');

const dbPath = process.argv[2] || '/home/sarapriyain/Projects/app/crm/data/splendid-crm.db';
const db = new Database(dbPath, { readonly: true });

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('contacts','companies') ORDER BY name")
  .all();

const contactsCount = db.prepare('SELECT COUNT(*) AS c FROM contacts').get().c;
const companiesCount = db.prepare('SELECT COUNT(*) AS c FROM companies').get().c;
const contactColumns = db.prepare("PRAGMA table_info(contacts)").all().map((c) => c.name);

const preferredColumns = ['id', 'name', 'first_name', 'last_name', 'email', 'company_id', 'company_name', 'created_at', 'updated_at'];
const selected = preferredColumns.filter((c) => contactColumns.includes(c));
const sampleSql = `SELECT ${selected.join(', ')} FROM contacts LIMIT 15`;
const sample = db.prepare(sampleSql).all();

console.log(JSON.stringify({ dbPath, tables, contactsCount, companiesCount, contactColumns, sample }, null, 2));

db.close();
