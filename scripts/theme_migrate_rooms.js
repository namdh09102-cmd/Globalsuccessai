const fs = require('fs');
const path = require('path');

const roomFiles = [
  'QuizRoom.tsx',
  'DictationRoom.tsx',
  'VisualRoom.tsx',
  'ExamRoom.tsx',
  'WorksheetRoom.tsx'
];

for (const file of roomFiles) {
  const targetFile = path.join(__dirname, '../src/components', file);
  if (!fs.existsSync(targetFile)) continue;
  
  let content = fs.readFileSync(targetFile, 'utf8');

  // Colors
  content = content.replace(/bg-\[\#0B0F19\](\/[0-9]+)?/g, 'bg-slate-50');
  content = content.replace(/bg-\[\#151B2B\](\/[0-9]+)?/g, 'bg-white');
  content = content.replace(/bg-\[\#111625\](\/[0-9]+)?/g, 'bg-white');
  content = content.replace(/bg-\[\#1d1b33\]/g, 'bg-indigo-50');
  content = content.replace(/bg-\[\#182033\]/g, 'bg-slate-50');
  content = content.replace(/bg-\[\#1E293B\]/g, 'bg-white');
  content = content.replace(/bg-\[\#334155\]/g, 'bg-slate-100');
  content = content.replace(/bg-\[\#090D16\](\/[0-9]+)?/g, 'bg-slate-900/40'); // For modals backdrop
  
  // Shadows
  content = content.replace(/shadow-\[0_0px_0_\#0a0f19\]/g, 'shadow-[0_0px_0_#e2e8f0]');
  content = content.replace(/shadow-\[0_4px_0_\#0a0f19\]/g, 'shadow-[0_4px_0_#e2e8f0]');

  // Borders & Text
  content = content.replace(/border-slate-800(\/[0-9]+)?/g, 'border-slate-200');
  content = content.replace(/border-slate-850(\/[0-9]+)?/g, 'border-slate-200');
  content = content.replace(/border-slate-700/g, 'border-slate-300');
  content = content.replace(/text-slate-200/g, 'text-slate-800');
  content = content.replace(/text-slate-300/g, 'text-slate-700');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  content = content.replace(/hover:border-slate-700/g, 'hover:border-indigo-300');
  content = content.replace(/hover:border-slate-800(\/[0-9]+)?/g, 'hover:border-indigo-200');
  
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Migrated', file);
}
