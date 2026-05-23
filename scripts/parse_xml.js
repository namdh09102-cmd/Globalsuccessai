const fs = require('fs');

const xml = fs.readFileSync('d:\\Antigravity_Projects\\Globalsuccess\\scripts\\key_docx_unzipped\\word\\document.xml', 'utf8');

// find "Studies show that doing chores _______ is good for children."
const idx = xml.indexOf('Studies show that doing chores');
if (idx !== -1) {
    const start = Math.max(0, idx);
    const end = Math.min(xml.length, idx + 2000);
    console.log(xml.substring(start, end));
} else {
    console.log("Not found.");
}
