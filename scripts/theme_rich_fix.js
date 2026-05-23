const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '../src/app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// Quick Action Cards to SOLID colors (đậm đà)
// Card 1: Học SGK
content = content.replace(
  /className="group relative rounded-3xl border border-blue-100 bg-blue-50\/40 p-5 cursor-pointer flex flex-col justify-between min-h-\[160px\] transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200"/g,
  'className="group relative rounded-3xl border-none bg-gradient-to-br from-blue-500 to-blue-600 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30"'
);
content = content.replace(
  /<h4 className="text-sm font-black text-slate-800">Học SGK<\/h4>\n                    <p className="text-\[10px\] text-slate-500 leading-relaxed max-w-\[200px\]">/g,
  '<h4 className="text-sm font-black text-white">Học SGK</h4>\n                    <p className="text-[10px] text-blue-100 leading-relaxed max-w-[200px]">'
);
content = content.replace(
  /<div className="w-12 h-12 rounded-2xl bg-indigo-500\/10 border border-indigo-500\/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-inner shrink-0">/g,
  '<div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner shrink-0">'
);


// Card 2: Luyện nghe Dictation
content = content.replace(
  /className="group relative rounded-3xl border border-purple-100 bg-purple-50\/40 p-5 cursor-pointer flex flex-col justify-between min-h-\[160px\] transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200"/g,
  'className="group relative rounded-3xl border-none bg-gradient-to-br from-violet-500 to-purple-600 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/30"'
);
content = content.replace(
  /<h4 className="text-sm font-black text-slate-800">Luyện nghe Dictation<\/h4>\n                    <p className="text-\[10px\] text-slate-500 leading-relaxed max-w-\[200px\]">/g,
  '<h4 className="text-sm font-black text-white">Luyện nghe Dictation</h4>\n                    <p className="text-[10px] text-purple-100 leading-relaxed max-w-[200px]">'
);
content = content.replace(
  /<div className="w-12 h-12 rounded-2xl bg-blue-500\/10 border border-blue-500\/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-inner shrink-0">/g,
  '<div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner shrink-0">'
);


// Card 3: Luyện nói AI
content = content.replace(
  /className="group relative rounded-3xl border border-indigo-100 bg-indigo-50\/40 p-5 cursor-pointer flex flex-col justify-between min-h-\[160px\] transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200"/g,
  'className="group relative rounded-3xl border-none bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 cursor-pointer flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30"'
);
content = content.replace(
  /<h4 className="text-sm font-black text-slate-800">Luyện nói AI<\/h4>\n                    <p className="text-\[10px\] text-slate-500 leading-relaxed max-w-\[200px\]">/g,
  '<h4 className="text-sm font-black text-white">Luyện nói AI</h4>\n                    <p className="text-[10px] text-indigo-100 leading-relaxed max-w-[200px]">'
);
content = content.replace(
  /<div className="w-12 h-12 rounded-2xl bg-violet-500\/10 border border-violet-500\/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform shadow-inner shrink-0">/g,
  '<div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner shrink-0">'
);

// Fix Chevron Buttons inside the 3 cards (currently white, change to transparent white)
content = content.replace(/<div className="w-6 h-6 rounded-full bg-white group-hover:bg-indigo-600 flex items-center justify-center text-slate-500 border border-slate-200 group-hover:border-indigo-600 shadow-sm">/g, 
  '<div className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white flex items-center justify-center text-white group-hover:text-indigo-600 border border-white/30 transition-all">');

// Fix the footers of the Quick Action Cards (number of students text)
content = content.replace(/<div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 text-\[9px\] text-slate-550 font-bold">/g, 
  '<div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-[9px] text-white/90 font-bold">');
content = content.replace(/<div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 text-\[9px\] text-slate-500 font-bold">/g, 
  '<div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-[9px] text-white/90 font-bold">');


// Now the Hero Banner: Let's give it a beautiful bright gradient instead of just white!
content = content.replace(
  /<div \n              className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 transition-transform duration-700 group-hover:scale-\[1.02\] pointer-events-none"\n            \/>/g,
  `<div 
              className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 transition-transform duration-700 group-hover:scale-[1.02] pointer-events-none"
            />
            {/* Background pattern overlay */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>`
);
// Make Hero banner text white so it pops on the emerald background
content = content.replace(
  /<h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2">/g,
  '<h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-2">'
);
content = content.replace(
  /<span className="text-xs font-bold text-indigo-400 tracking-wide block">Chào mừng trở lại,<\/span>/g,
  '<span className="text-xs font-bold text-emerald-100 tracking-wide block">Chào mừng trở lại,</span>'
);
content = content.replace(
  /<p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">/g,
  '<p className="text-xs text-emerald-50 max-w-sm mt-2 leading-relaxed">'
);
content = content.replace(
  /<div className="max-w-\[280px\] p-4 rounded-2xl bg-slate-50 backdrop-blur-md border border-slate-200 text-slate-800 shadow-xl space-y-2 relative">/g,
  '<div className="max-w-[280px] p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl space-y-2 relative">'
);
content = content.replace(
  /<span className="absolute top-2 left-2 text-indigo-500 opacity-20 text-3xl font-serif leading-none">/g,
  '<span className="absolute top-2 left-2 text-white opacity-20 text-3xl font-serif leading-none">'
);
content = content.replace(
  /<p className="text-\[10px\] leading-relaxed italic text-slate-800 pl-2">/g,
  '<p className="text-[10px] leading-relaxed italic text-white pl-2">'
);
content = content.replace(
  /<p className="text-\[9px\] font-bold text-slate-500 text-right">/g,
  '<p className="text-[9px] font-bold text-emerald-100 text-right">'
);
// Hero button
content = content.replace(
  /className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95 group\/btn"/g,
  'className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-emerald-600 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-95 group/btn"'
);
content = content.replace(
  /<Play className="w-3.5 h-3.5 fill-white group-hover\/btn:scale-110 transition-transform" \/>/g,
  '<Play className="w-3.5 h-3.5 fill-emerald-600 group-hover/btn:scale-110 transition-transform" />'
);

// Let's modify layout.tsx body to bg-slate-100 to make components pop more
const layoutFile = path.join(__dirname, '../src/app/layout.tsx');
let layoutContent = fs.readFileSync(layoutFile, 'utf8');
layoutContent = layoutContent.replace(/bg-slate-50 text-slate-800/g, 'bg-slate-100 text-slate-800');
fs.writeFileSync(layoutFile, layoutContent, 'utf8');

fs.writeFileSync(pageFile, content, 'utf8');

console.log('Done tweaking colors for RICH contrast!');
