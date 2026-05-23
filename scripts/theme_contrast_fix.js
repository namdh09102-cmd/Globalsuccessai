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

  // 1. Fix Headers (Invisible white gradients)
  content = content.replace(/from-white via-slate-100 to-slate-300/g, 'from-slate-800 via-slate-700 to-slate-500');
  content = content.replace(/from-white to-slate-400/g, 'from-slate-800 to-slate-500');
  content = content.replace(/from-white via-violet-200 to-amber-300/g, 'from-violet-800 via-violet-600 to-amber-600');
  content = content.replace(/text-slate-100/g, 'text-slate-800');

  // 2. Fix Custom / Invalid Tailwind Colors
  content = content.replace(/text-slate-350/g, 'text-slate-400');
  content = content.replace(/text-slate-450/g, 'text-slate-500');
  content = content.replace(/text-slate-550/g, 'text-slate-600');
  content = content.replace(/text-slate-650/g, 'text-slate-700');
  content = content.replace(/bg-slate-850/g, 'bg-slate-100');
  content = content.replace(/border-slate-850/g, 'border-slate-300');
  content = content.replace(/divide-slate-850\/30/g, 'divide-slate-200');

  // 3. Fix dark boxes that were missed (AI Coach Feedback Panels, etc.)
  content = content.replace(/bg-gradient-to-br from-\[\#121626\] to-\[\#151930\]/g, 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200');
  content = content.replace(/bg-\[\#1E293B\]/g, 'bg-white');
  content = content.replace(/bg-\[\#070A13\]/g, 'bg-slate-50');

  // 4. Fix Dark text on Dark buttons (e.g. bg-indigo-600 text-slate-800 -> text-white)
  // This is tricky with regex, so let's do common buttons:
  content = content.replace(/bg-indigo-600 hover:bg-indigo-500 text-slate-800/g, 'bg-indigo-600 hover:bg-indigo-500 text-white');
  content = content.replace(/bg-emerald-600 hover:bg-emerald-500 text-slate-800/g, 'bg-emerald-600 hover:bg-emerald-500 text-white');
  content = content.replace(/bg-violet-600 hover:bg-violet-500 text-slate-800/g, 'bg-violet-600 hover:bg-violet-500 text-white');
  content = content.replace(/bg-blue-600 hover:bg-blue-500 text-slate-800/g, 'bg-blue-600 hover:bg-blue-500 text-white');
  content = content.replace(/from-violet-600 to-indigo-600 text-slate-800/g, 'from-violet-600 to-indigo-600 text-white');
  content = content.replace(/from-emerald-600 to-teal-500 text-slate-800/g, 'from-emerald-600 to-teal-500 text-white');
  content = content.replace(/from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-slate-800/g, 'from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white');

  // Profile avatar text:
  content = content.replace(/text-transparent bg-gradient-to-tr from-violet-400 to-blue-400/g, 'text-transparent bg-gradient-to-tr from-violet-600 to-blue-600');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed contrast in', filePath);
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

// Also process some components
processFile(path.join(__dirname, '../src/components/RightPanel.tsx'));
processFile(path.join(__dirname, '../src/components/Sidebar.tsx'));
processFile(path.join(__dirname, '../src/components/ClientLayoutWrapper.tsx'));

console.log('Contrast fix complete!');
