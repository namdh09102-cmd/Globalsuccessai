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

  // Text colors on white backgrounds
  content = content.replace(/text-slate-100/g, 'text-slate-800');
  content = content.replace(/text-white(?! \w*(?:fill|bg|border))/g, 'text-slate-800'); // Be careful with text-white if it's on a button, but let's replace generic text-white on cards.
  // Wait, `text-white` on buttons is fine. I'll just replace `text-slate-100` to `text-slate-800` which is the main culprit from the dashboard.
  
  // Specific `text-white` cases
  content = content.replace(/text-white truncate/g, 'text-slate-800 truncate');
  content = content.replace(/text-white tracking-tight/g, 'text-slate-800 tracking-tight');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Migrated text colors in', filePath);
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

console.log('Text colors fixed!');
