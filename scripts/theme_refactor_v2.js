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

  // 1. Color replacements
  // Purple/Violet/Fuchsia -> Indigo
  content = content.replace(/violet-/g, 'indigo-');
  content = content.replace(/purple-/g, 'indigo-');
  content = content.replace(/fuchsia-/g, 'indigo-');
  
  // Emerald/Green -> Teal
  content = content.replace(/emerald-/g, 'teal-');
  content = content.replace(/green-/g, 'teal-');

  // Hardcoded hex colors
  content = content.replace(/#4B3F72/ig, '#4338CA'); // indigo-700
  content = content.replace(/#7B5EA7/ig, '#6366F1'); // indigo-500

  // 2. Border radius standardization
  // Cards: 12px (rounded-xl)
  // We downgrade 3xl and 2xl to xl
  content = content.replace(/rounded-3xl/g, 'rounded-xl');
  content = content.replace(/rounded-2xl/g, 'rounded-xl');
  
  // Wait! Buttons might be using rounded-xl now.
  // We'll replace rounded-xl on buttons specifically if we can, or just let them be rounded-xl for now and fix manually.
  // Actually, to make buttons rounded-lg, let's look for common button patterns:
  content = content.replace(/button[^>]*className="([^"]*)rounded-xl([^"]*)"/g, 'button className="$1rounded-lg$2"');
  content = content.replace(/<button([^>]*)rounded-xl([^>]*)>/g, '<button$1rounded-lg$2>');
  // And Link buttons
  content = content.replace(/Link[^>]*href[^>]*className="([^"]*)rounded-xl([^"]*)"/g, 'Link href className="$1rounded-lg$2"'); // careful with this regex, better do it manually for links if too complex.

  // 3. Text colors
  // Replace text-slate-700 with text-slate-500 for muted? No, user said text-default: slate-800, text-muted: slate-500
  // Earlier we might have used text-slate-700. We'll leave slate-700 as is, or maybe replace it. Let's just fix the specific issues manually if needed.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Refactored theme in', filePath);
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

// Process specific files
const specificFiles = [
  '../src/components/RightPanel.tsx',
  '../src/components/Sidebar.tsx',
  '../src/components/QuizRoom.tsx',
  '../src/components/ClientLayoutWrapper.tsx',
  '../src/components/TopNavbar.tsx', // if exists
  '../src/app/page.tsx',
  '../src/app/layout.tsx',
  '../src/app/globals.css'
];

for (const sf of specificFiles) {
  processFile(path.join(__dirname, sf));
}

console.log('Theme refactor script completed.');
