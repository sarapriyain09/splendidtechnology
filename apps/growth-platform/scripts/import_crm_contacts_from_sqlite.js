const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { Client } = require('pg');
const { randomUUID } = require('crypto');

const sqlitePath = process.argv[2] || '/home/sarapriyain/Projects/app/crm/data/splendid-crm.db';
const envPath = process.argv[3] || '/home/sarapriyain/Projects/app/crm/.env';

function readDatabaseUrl(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const line = text
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith('DATABASE_URL='));
  if (!line) throw new Error('DATABASE_URL not found in ' + filePath);
  const raw = line.slice('DATABASE_URL='.length).trim();
  return raw.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
}

function splitName(fullName) {
  const value = (fullName || '').trim();
  if (!value) return { firstName: null, lastName: null, name: null };
  const parts = value.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: null, name: value };
  return { firstName: parts[0], lastName: parts.slice(1).join(' '), name: value };
}

async function main() {
  const databaseUrl = readDatabaseUrl(envPath);
  const sqlite = new Database(sqlitePath, { readonly: true });
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const rows = sqlite
      .prepare("SELECT id, name, email, phone, job_title, role, company FROM contacts ORDER BY id ASC")
      .all();

    const companiesRes = await client.query('SELECT id, name FROM companies');
    const companyByName = new Map();
    for (const c of companiesRes.rows) {
      const key = String(c.name || '').trim().toLowerCase();
      if (key) companyByName.set(key, c.id);
    }

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      const fullName = String(row.name || '').trim();
      const email = String(row.email || '').trim() || null;
      const phone = String(row.phone || '').trim() || null;
      const jobTitle = String(row.job_title || row.role || '').trim() || null;
      const companyName = String(row.company || '').trim();
      const companyId = companyName ? companyByName.get(companyName.toLowerCase()) || null : null;

      if (!fullName) {
        skipped += 1;
        continue;
      }

      const parsed = splitName(fullName);

      const exists = await client.query(
        'SELECT id FROM contacts WHERE lower(coalesce(name,\'\')) = lower($1) AND lower(coalesce(email,\'\')) = lower($2) LIMIT 1',
        [parsed.name, email || '']
      );
      if (exists.rows.length > 0) {
        skipped += 1;
        continue;
      }

      await client.query(
        'INSERT INTO contacts (id_text_legacy, "firstName", "lastName", name, email, phone, "jobTitle", "companyId", "updatedAt", uuid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9)',
        [String(row.id), parsed.firstName, parsed.lastName, parsed.name, email, phone, jobTitle, companyId, randomUUID()]
      );
      inserted += 1;
    }

    const totalRes = await client.query('SELECT COUNT(*)::int AS c FROM contacts');
    console.log(JSON.stringify({ sqlitePath, sourceRows: rows.length, inserted, skipped, totalContacts: totalRes.rows[0].c }, null, 2));
  } finally {
    sqlite.close();
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
