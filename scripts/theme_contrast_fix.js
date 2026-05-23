const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '../src/app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// 1. "Học SGK" card
content = content.replace(
  /<div \n                onClick=\{\(\) => \{\n                  document.getElementById\("curriculum-section"\)\?.scrollIntoView\(\{ behavior: "smooth" \}\);\n                \}\}\n                className="group relative rounded-3xl border border-slate-200 bg-white p-5 cursor-pointer flex flex-col justify-between min-h-\[160px\] transition-all duration-300 hover:border-indigo-500\/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-950\/20"/g,
  `<div 
                onClick={() => {
                  document.getElementById("curriculum-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative rounded-3xl border border-blue-100 bg-blue-50/40 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200"`
);

// 2. "Luyện nghe Dictation" card
content = content.replace(
  /className="group relative rounded-3xl border border-slate-200 bg-white p-5 cursor-pointer flex flex-col justify-between min-h-\[160px\] transition-all duration-300 hover:border-indigo-500\/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-950\/20"/g,
  `className="group relative rounded-3xl border border-indigo-100 bg-indigo-50/40 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200"`
);

// We need to apply it specifically for each card because the original regex replaced all remaining matching classes. 
// The second match will be dictation, third will be speaking. But since they had the exact same class string:
// Actually, I can just replace all instances of that long class string with a generic colorful one, or just `border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 hover:shadow-indigo-200`.
// Let's re-read and fix the script.

content = fs.readFileSync(pageFile, 'utf8');

// Replace Quick Action cards general class string:
// class: group relative rounded-3xl border border-slate-200 bg-white p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-950/20
const oldClass = 'group relative rounded-3xl border border-slate-200 bg-white p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-950/20';

// We have 3 cards. I will replace them one by one if they exist.
if (content.includes(oldClass)) {
  content = content.replace(oldClass, 'group relative rounded-3xl border border-blue-100 bg-blue-50/40 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200');
  content = content.replace(oldClass, 'group relative rounded-3xl border border-purple-100 bg-purple-50/40 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200');
  content = content.replace(oldClass, 'group relative rounded-3xl border border-indigo-100 bg-indigo-50/40 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200');
}

// Chevron buttons in these cards:
// from `bg-slate-900 group-hover:bg-indigo-600` to `bg-indigo-100 group-hover:bg-indigo-600 text-indigo-500 group-hover:text-white`
content = content.replace(/bg-slate-900 group-hover:bg-indigo-600 flex items-center justify-center text-slate-500/g, 'bg-white group-hover:bg-indigo-600 flex items-center justify-center text-slate-500 border border-slate-200 group-hover:border-indigo-600 shadow-sm');

// Top Stats row (Bài đã học, Độ chính xác, XP):
// from `bg-slate-50 border-slate-200` to `bg-white border-slate-200 shadow-md`
content = content.replace(/bg-slate-50 border-slate-200 shadow-sm backdrop-blur-sm border/g, 'bg-white border-slate-200 shadow-md backdrop-blur-sm border');

// Unit cards:
// line 1383 `? "border-indigo-500/50 bg-white" : "border-slate-200 bg-white hover:border-slate-300"`
content = content.replace(/\? "border-indigo-500\/50 bg-white"/g, '? "border-indigo-400 bg-indigo-50/30 shadow-md"');
content = content.replace(/: "border-slate-200 bg-white hover:border-slate-300"/g, ': "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white hover:shadow-md"');
// Change Unit card shadow-xl to shadow-sm
content = content.replace(/min-h-\[180px\] transition-all duration-300 shadow-xl group cursor-pointer/g, 'min-h-[180px] transition-all duration-300 shadow-sm group cursor-pointer');

// Progress bar background `bg-slate-800` inside Unit card -> `bg-slate-200`
content = content.replace(/<div className="h-1 bg-slate-800 rounded-full overflow-hidden">/g, '<div className="h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300/50">');

// Unit details locked container opacity
content = content.replace(/border-slate-200 bg-slate-50 opacity-70 hover:opacity-90/g, 'border-slate-200 bg-slate-100 opacity-60');

fs.writeFileSync(pageFile, content, 'utf8');

// RightPanel tweaks
const rpFile = path.join(__dirname, '../src/components/RightPanel.tsx');
let rpContent = fs.readFileSync(rpFile, 'utf8');

// Change `bg-slate-50` to `bg-white` inside RightPanel for stats boxes so they pop against the white RightPanel (Wait! If RightPanel is white, white boxes don't pop. They need colored tints!)
// Stats detailed list
rpContent = rpContent.replace(/bg-slate-50 flex flex-col/g, 'bg-white border-slate-200 flex flex-col hover:border-indigo-300 hover:shadow-md transition-all');

// Nhiệm vụ hôm nay cards
rpContent = rpContent.replace(/bg-white border border-slate-200 flex items-center/g, 'bg-white border border-slate-200 shadow-sm hover:shadow-md flex items-center');

fs.writeFileSync(rpFile, rpContent, 'utf8');

console.log('Done tweaking colors for contrast!');
