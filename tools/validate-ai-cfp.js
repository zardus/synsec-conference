#!/usr/bin/env node
const fs = require('fs');

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    fail(`Could not parse JSON at ${path}: ${e.message}`);
    return null;
  }
}

const target = process.argv[2] || 'ai-cfp.json';
const data = readJson(target);
if (!data) process.exit(1);

const requiredTop = [
  'name','short_name','website','version','last_updated','timezone',
  'event','submission','tracks','review','agent_resources'
];
for (const k of requiredTop) {
  if (!(k in data)) fail(`Missing top-level field: ${k}`);
}

if (data.event) {
  for (const k of ['type','location','date_text','proceedings']) {
    if (!(k in data.event)) fail(`Missing event.${k}`);
  }
  if (data.event.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.event.start_date)) {
    fail('event.start_date must be YYYY-MM-DD');
  }
  if (data.event.end_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.event.end_date)) {
    fail('event.end_date must be YYYY-MM-DD');
  }
}

if (data.submission) {
  const s = data.submission;
  for (const k of ['portal','deadline','required','policy']) {
    if (!(k in s)) fail(`Missing submission.${k}`);
  }
  if ('cycles' in s) {
    if (!Array.isArray(s.cycles) || s.cycles.length === 0) {
      fail('submission.cycles must be a non-empty array');
    } else {
      s.cycles.forEach((c, i) => {
        for (const k of ['id','name','status','portal','deadline']) {
          if (!(k in c)) fail(`Missing submission.cycles[${i}].${k}`);
        }
      });
    }
  }
}

if (!Array.isArray(data.tracks) || data.tracks.length === 0) {
  fail('tracks must be a non-empty array');
} else {
  data.tracks.forEach((t, i) => {
    for (const k of ['id','name','type','requirements']) {
      if (!(k in t)) fail(`Missing tracks[${i}].${k}`);
    }
    if (!Array.isArray(t.requirements) || t.requirements.length === 0) {
      fail(`tracks[${i}].requirements must be a non-empty array`);
    }
  });
}

if (data.agent_resources) {
  for (const k of ['llms','llms_full','agent_task','change_feed']) {
    if (!(k in data.agent_resources)) fail(`Missing agent_resources.${k}`);
  }
}

if (!process.exitCode) ok(`${target} passed lightweight validation`);
