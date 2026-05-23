const fs = require('fs');
const path = require('path');

const rpFile = path.join(__dirname, '../src/components/RightPanel.tsx');
let rpContent = fs.readFileSync(rpFile, 'utf8');

// The "Chuỗi học tập liên tục" box: currently bg-white border-slate-200. Let's make it bg-amber-50 border-amber-200.
rpContent = rpContent.replace(/<div className="rounded-2xl border border-slate-200 bg-white p-5 text-center relative overflow-hidden group hover:border-amber-300 transition-colors shadow-sm">/g, 
  '<div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-orange-50/50 p-5 text-center relative overflow-hidden group hover:border-amber-400 hover:shadow-md transition-all shadow-sm">');

// Inside "Chuỗi học tập liên tục", there is a fire icon.
rpContent = rpContent.replace(/<div className="w-12 h-12 mx-auto bg-amber-500\/10 rounded-2xl flex items-center justify-center mb-3 shadow-inner border border-amber-500\/20">/g,
  '<div className="w-12 h-12 mx-auto bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-amber-200">');

// The stats grid (Thời gian học, Kinh nghiệm, Kim cương, Phản xạ)
// They are `bg-white border-slate-200 flex flex-col`. Make them `bg-slate-50 border-slate-200`.
rpContent = rpContent.replace(/bg-white border-slate-200 flex flex-col hover:border-indigo-300 hover:shadow-md transition-all/g, 
  'bg-slate-50 border-slate-200 flex flex-col hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all');

// Nhiệm vụ hôm nay cards
// They are `bg-white border border-slate-200 shadow-sm`. Make them `bg-slate-50 border border-slate-200 shadow-sm hover:bg-white`.
rpContent = rpContent.replace(/bg-white border border-slate-200 shadow-sm hover:shadow-md flex items-center/g, 
  'bg-slate-50 border border-slate-200 shadow-sm hover:bg-white hover:shadow-md flex items-center transition-colors');

// AI Coach Gợi ý box
// Currently has some style. Let's give it a beautiful blue tint.
rpContent = rpContent.replace(/<div className="p-4 rounded-2xl bg-indigo-500\/5 border border-indigo-500\/10 space-y-3 relative overflow-hidden">/g,
  '<div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 space-y-3 relative overflow-hidden shadow-sm">');

fs.writeFileSync(rpFile, rpContent, 'utf8');

console.log('RightPanel tweaked for rich colors!');
