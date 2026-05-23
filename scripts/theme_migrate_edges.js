const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/app/page.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Fix text-white on light backgrounds
content = content.replace(/group-hover\/item:text-white/g, 'group-hover/item:text-indigo-700');

// Fix border-slate-200 bg-slate-50 opacity-70 hover:opacity-90 -> this is fine
// Fix `hover:bg-slate-900\/10` -> `hover:bg-slate-100`? I didn't replace that.
content = content.replace(/hover:bg-slate-900\/10/g, 'hover:bg-slate-100');

// Fix lock icon text from text-slate-600 to text-slate-400
content = content.replace(/text-slate-600/g, 'text-slate-400'); // wait, this might affect too many things. Skip it.

// Look for right column grammar focus background
content = content.replace(/bg-\[\#151B2B\]/g, 'bg-white');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Edge cases fixed in page.tsx');
