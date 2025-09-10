#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'html');

let hits = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p);
    } else if (e.isFile() && p.toLowerCase().endsWith('.html')) {
      scanFile(p);
    }
  }
}

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const regex = /style\s*=\s*["'][^"']*["']/ig;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    regex.lastIndex = 0;
    if (regex.test(line)) {
      regex.lastIndex = 0;
      const matches = [...line.matchAll(regex)].map(m => m[0]);
      hits.push({
        file,
        line: i + 1,
        column: line.toLowerCase().indexOf('style=') + 1,
        snippet: line.trim().slice(0, 200),
        matches
      });
    }
  }
}

if (!fs.existsSync(TARGET_DIR)) {
  console.error('Directory "html" not found.');
  process.exit(2);
}

walk(TARGET_DIR);

if (hits.length) {
  console.error(`Inline style attributes found (${hits.length} match lines):`);
  const rel = f => path.relative(ROOT, f).replace(/\\/g, '/');
  for (const h of hits) {
    console.error(`${rel(h.file)}:${h.line}:${h.column} ${h.matches.join(' | ')}`);
    console.error(`  ${h.snippet}`);
  }
  process.exit(1);
} else {
  console.log('No inline style attributes found in html/**/*.html');
}