const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/app/page.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// The replacements map
const replacements = [
  { from: /bg-\[\#0B0F19\](\/[0-9]+)?/g, to: 'bg-slate-50' },
  { from: /bg-\[\#151B2B\]/g, to: 'bg-white' },
  { from: /bg-\[\#111625\]/g, to: 'bg-white' },
  { from: /border-slate-800(\/[0-9]+)?/g, to: 'border-slate-200' },
  { from: /border-slate-850(\/[0-9]+)?/g, to: 'border-slate-200' },
  { from: /border-slate-700/g, to: 'border-slate-300' },
  { from: /text-slate-200/g, to: 'text-slate-800' },
  { from: /text-slate-300/g, to: 'text-slate-700' },
  { from: /text-slate-400/g, to: 'text-slate-500' },
  { from: /hover:border-slate-700/g, to: 'hover:border-indigo-300' },
  { from: /hover:border-slate-800(\/[0-9]+)?/g, to: 'hover:border-indigo-200' },
  { from: /hover:bg-slate-900(\/[0-9]+)?/g, to: 'hover:bg-indigo-50' },
  { from: /shadow-2xl/g, to: 'shadow-xl shadow-slate-200/50' },
  { from: /shadow-xl/g, to: 'shadow-lg shadow-slate-200/50' },
  { from: /text-white/g, to: 'text-slate-800' }, // Be careful, might break button text
];

// We need to be careful with text-white since it's used in buttons (where we want text-white)
// Let's manually replace `text-white` only in certain contexts or skip it.
// Actually, `text-white` is usually fine for gradients, but in headers we want `text-slate-800`.
// Let's refine the script to not touch `text-white` globally.

content = content.replace(/bg-\[\#0B0F19\](\/[0-9]+)?/g, 'bg-slate-50');
content = content.replace(/bg-\[\#151B2B\](\/[0-9]+)?/g, 'bg-white');
content = content.replace(/bg-\[\#111625\](\/[0-9]+)?/g, 'bg-white');
content = content.replace(/border-slate-800(\/[0-9]+)?/g, 'border-slate-200');
content = content.replace(/border-slate-850(\/[0-9]+)?/g, 'border-slate-200');
content = content.replace(/border-slate-700/g, 'border-slate-300');
content = content.replace(/text-slate-200/g, 'text-slate-800');
content = content.replace(/text-slate-300/g, 'text-slate-700');
content = content.replace(/text-slate-400/g, 'text-slate-500');
content = content.replace(/hover:border-slate-700/g, 'hover:border-indigo-300');
content = content.replace(/hover:border-slate-800(\/[0-9]+)?/g, 'hover:border-indigo-200');
content = content.replace(/hover:bg-slate-900(\/[0-9]+)?/g, 'hover:bg-indigo-50');

// Fix specific text-white issues in headings
content = content.replace(/text-white font-black/g, 'text-slate-800 font-black');
content = content.replace(/text-white uppercase/g, 'text-slate-800 uppercase');
content = content.replace(/text-white tracking-tight/g, 'text-slate-800 tracking-tight');
content = content.replace(/text-white truncate/g, 'text-slate-800 truncate');

// Make the big banner "Chào mừng trở lại" more vibrant
// Currently it is: from-[#111625] to-[#0A0D18]
content = content.replace(/from-\[\#111625\]/g, 'from-indigo-50');
content = content.replace(/to-\[\#0A0D18\]/g, 'to-blue-50');
content = content.replace(/bg-\[\#04060d\]/g, 'bg-white');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Theme migration applied to page.tsx!');
