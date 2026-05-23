const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/app/page.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Fix Hero Banner dark gradient
content = content.replace(
  /linear-gradient\(to right, rgba\(11, 15, 25, 0\.95\) 30%, rgba\(11, 15, 25, 0\.5\) 60%, rgba\(11, 15, 25, 0\.8\) 100%\)/g,
  "linear-gradient(to right, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0.8) 100%)"
);

// Fix stats bar inside banner
content = content.replace(/bg-slate-900\/40/g, 'bg-slate-50 border-slate-200 shadow-sm');
content = content.replace(/text-slate-100/g, 'text-slate-800');
content = content.replace(/text-slate-350/g, 'text-slate-500');

// Fix Quick Actions background (lines 1251+)
// group relative rounded-3xl border border-slate-200 bg-white
// text-white -> text-slate-800
content = content.replace(/bg-\[\#151B2B\]/g, 'bg-white');
content = content.replace(/border-slate-800\/80/g, 'border-slate-200');

// Replace standard dark mode classes still missed
content = content.replace(/bg-slate-800\/65/g, 'bg-slate-100');
content = content.replace(/bg-\[\#0B0F19\]\/40/g, 'bg-slate-50');
content = content.replace(/bg-slate-800\/40/g, 'bg-slate-100');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Hero Banner & Quick Actions updated for light theme!');
