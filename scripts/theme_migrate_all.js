const fs = require('fs');
const path = require('path');

const dirs = [
  'dashboard',
  'ai-practice',
  'profile',
  'history',
  'teacher',
  'upgrade',
  'admin',
  'auth',
  'learn'
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Background Colors
  content = content.replace(/bg-\[\#0B0F19\](\/[0-9]+)?/g, 'bg-slate-50');
  content = content.replace(/bg-\[\#151B2B\](\/[0-9]+)?/g, 'bg-white');
  content = content.replace(/bg-\[\#111625\](\/[0-9]+)?/g, 'bg-white');
  content = content.replace(/bg-\[\#1d1b33\]/g, 'bg-indigo-50');
  content = content.replace(/bg-\[\#182033\]/g, 'bg-slate-50');
  content = content.replace(/bg-\[\#1E293B\]/g, 'bg-white');
  content = content.replace(/bg-\[\#334155\]/g, 'bg-slate-100');
  content = content.replace(/bg-\[\#090D16\](\/[0-9]+)?/g, 'bg-slate-900/40');
  content = content.replace(/bg-slate-800(\/[0-9]+)?/g, 'bg-slate-100');
  content = content.replace(/bg-slate-900(\/[0-9]+)?/g, 'bg-slate-100');

  // Specific dark theme gradient replacements (e.g. radar chart background)
  content = content.replace(/from-\[\#111625\]/g, 'from-indigo-50');
  content = content.replace(/to-\[\#0A0D18\]/g, 'to-purple-50');
  content = content.replace(/from-\[\#0B0F19\]/g, 'from-white');
  content = content.replace(/to-\[\#151B2B\]/g, 'to-slate-50');
  content = content.replace(/bg-\[\#04060d\]/g, 'bg-white');

  // Borders
  content = content.replace(/border-slate-800(\/[0-9]+)?/g, 'border-slate-200');
  content = content.replace(/border-slate-850(\/[0-9]+)?/g, 'border-slate-200');
  content = content.replace(/border-slate-700/g, 'border-slate-300');

  // Text
  content = content.replace(/text-slate-200/g, 'text-slate-800');
  content = content.replace(/text-slate-300/g, 'text-slate-700');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  // Text white is tricky, let's just replace specific combinations that look bad on white
  content = content.replace(/text-white font-black/g, 'text-slate-800 font-black');
  content = content.replace(/text-white uppercase/g, 'text-slate-800 uppercase');
  content = content.replace(/text-white tracking-tight/g, 'text-slate-800 tracking-tight');
  
  // Hover states
  content = content.replace(/hover:border-slate-700/g, 'hover:border-indigo-300');
  content = content.replace(/hover:border-slate-800(\/[0-9]+)?/g, 'hover:border-indigo-200');
  content = content.replace(/hover:bg-slate-900(\/[0-9]+)?/g, 'hover:bg-indigo-50');

  // Shadows
  content = content.replace(/shadow-\[0_0px_0_\#0a0f19\]/g, 'shadow-[0_0px_0_#e2e8f0]');
  content = content.replace(/shadow-\[0_4px_0_\#0a0f19\]/g, 'shadow-[0_4px_0_#e2e8f0]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Migrated', filePath);
  }
}

// Process all subdirectories
for (const dir of dirs) {
  const pagePath = path.join(__dirname, '../src/app', dir, 'page.tsx');
  processFile(pagePath);
  
  // Also check if there are nested components inside those dirs
  const files = fs.readdirSync(path.join(__dirname, '../src/app', dir));
  for (const f of files) {
    if (f.endsWith('.tsx') && f !== 'page.tsx') {
      processFile(path.join(__dirname, '../src/app', dir, f));
    }
  }
}

console.log('All remaining pages migrated to Light Theme!');
