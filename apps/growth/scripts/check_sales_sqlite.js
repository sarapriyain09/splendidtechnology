const Database = require('better-sqlite3');

const dbPath = process.argv[2] || '/home/sarapriyain/Projects/app/sales/data/splendid-crm.db';
const db = new Database(dbPath, { readonly: true });

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('opportunities','pipelines','pipeline_stages') ORDER BY name")
  .all();

const opportunities = db.prepare('SELECT COUNT(*) AS c FROM opportunities').get().c;
const pipelines = db.prepare('SELECT COUNT(*) AS c FROM pipelines').get().c;
const pipelineStages = db.prepare('SELECT COUNT(*) AS c FROM pipeline_stages').get().c;

const latest = db
  .prepare('SELECT id, opportunity_name, status, updated_at FROM opportunities ORDER BY updated_at DESC LIMIT 20')
  .all();

console.log(JSON.stringify({ dbPath, tables, opportunities, pipelines, pipelineStages, latest }, null, 2));

db.close();
