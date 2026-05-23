const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const replacements = [
  // Backgrounds
  { regex: /\bbg-slate-50\b/g, replace: 'bg-page' },
  { regex: /\bbg-slate-100\b/g, replace: 'bg-card' },
  { regex: /\bbg-slate-200\b/g, replace: 'bg-page' },
  { regex: /\bbg-indigo-500\/10\b/g, replace: 'bg-primary-light' },
  { regex: /\bbg-indigo-50\b/g, replace: 'bg-primary-light' },
  { regex: /\bbg-indigo-100\b/g, replace: 'bg-primary-light' },
  { regex: /\bbg-indigo-500\b/g, replace: 'bg-primary' },
  { regex: /\bbg-indigo-600\b/g, replace: 'bg-primary text-white border-[var(--c-border)] border-primary-dark shadow-[0_4px_0_var(--c-primary-dark)]' },
  { regex: /\bhhover:bg-indigo-50\b/g, replace: 'hover:bg-primary-light' },
  { regex: /\bbg-white\b/g, replace: 'bg-card' },

  // Text colors
  { regex: /\btext-slate-400\b/g, replace: 'text-text-muted' },
  { regex: /\btext-slate-500\b/g, replace: 'text-text-muted' },
  { regex: /\btext-slate-600\b/g, replace: 'text-text-body' },
  { regex: /\btext-slate-700\b/g, replace: 'text-text-body' },
  { regex: /\btext-slate-800\b/g, replace: 'text-text-head' },
  { regex: /\btext-indigo-500\b/g, replace: 'text-primary' },
  { regex: /\btext-indigo-600\b/g, replace: 'text-primary' },
  { regex: /\btext-indigo-700\b/g, replace: 'text-primary-dark' },

  // Borders
  { regex: /\bborder-slate-100\b/g, replace: 'border-[var(--c-primary-light)]' },
  { regex: /\bborder-slate-200\b/g, replace: 'border-[rgba(0,0,0,0.1)]' },
  { regex: /\bborder-indigo-200\b/g, replace: 'border-primary-dark' },
  { regex: /\bborder-indigo-300\b/g, replace: 'border-primary-dark' },

  // Radii
  { regex: /\brounded-xl\b/g, replace: 'rounded-[var(--radius-card)]' },
  { regex: /\brounded-2xl\b/g, replace: 'rounded-[var(--radius-card)]' },
  { regex: /\brounded-lg\b/g, replace: 'rounded-[var(--radius-btn)]' },

  // Fonts
  { regex: /\bfont-semibold\b/g, replace: 'font-bold' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      // Specifically target Dashboard page.tsx heading
      if (fullPath.endsWith('page.tsx')) {
        content = content.replace('text-3xl md:text-4xl font-black text-white', 'text-3xl md:text-4xl font-black text-primary-dark font-fredoka uppercase');
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(srcDir);
console.log('Refactoring complete.');
