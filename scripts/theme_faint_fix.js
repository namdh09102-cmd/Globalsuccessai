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

  // Make text colors bolder for light theme (from 400/500 to 600/700)
  const colorMap = {
    'text-blue-400': 'text-blue-600',
    'text-blue-300': 'text-blue-600',
    'text-violet-400': 'text-violet-600',
    'text-violet-300': 'text-violet-600',
    'text-emerald-400': 'text-emerald-600',
    'text-emerald-300': 'text-emerald-600',
    'text-indigo-400': 'text-indigo-600',
    'text-indigo-300': 'text-indigo-600',
    'text-amber-400': 'text-amber-600',
    'text-amber-300': 'text-amber-600',
    'text-fuchsia-400': 'text-fuchsia-600',
    'text-fuchsia-300': 'text-fuchsia-600',
    'text-teal-400': 'text-teal-600',
    'text-teal-300': 'text-teal-600',
    'text-rose-400': 'text-rose-600',
    'text-rose-300': 'text-rose-600',
    'text-pink-400': 'text-pink-600',
    'text-pink-300': 'text-pink-600',
    'text-purple-400': 'text-purple-600',
    'text-purple-300': 'text-purple-600',
    'border-violet-500/20': 'border-violet-300',
    'border-blue-500/20': 'border-blue-300',
    'border-emerald-500/20': 'border-emerald-300',
    'border-indigo-500/20': 'border-indigo-300',
    'border-amber-500/20': 'border-amber-300'
  };

  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    content = content.replaceAll(oldColor, newColor);
  }

  // Also fix "bg-slate-800 text-slate-500" combinations in badges
  content = content.replace(/bg-slate-800 text-slate-500/g, 'bg-slate-200 text-slate-700');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed faint colors in', filePath);
  }
}

// Process all subdirectories
for (const dir of dirs) {
  const pagePath = path.join(__dirname, '../src/app', dir, 'page.tsx');
  processFile(pagePath);
  
  const dirPath = path.join(__dirname, '../src/app', dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const f of files) {
      if (f.endsWith('.tsx') && f !== 'page.tsx') {
        processFile(path.join(dirPath, f));
      }
    }
  }
}

// Also process some components
processFile(path.join(__dirname, '../src/components/RightPanel.tsx'));
processFile(path.join(__dirname, '../src/components/Sidebar.tsx'));
processFile(path.join(__dirname, '../src/components/QuizRoom.tsx'));
processFile(path.join(__dirname, '../src/app/page.tsx'));

console.log('Faint color fix complete!');
