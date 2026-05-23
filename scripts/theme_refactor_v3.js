const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, '../src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    content = content.replace(/emerald-/g, 'teal-');
    content = content.replace(/violet-/g, 'indigo-');
    content = content.replace(/purple-/g, 'indigo-');
    content = content.replace(/fuchsia-/g, 'indigo-');
    content = content.replace(/rounded-3xl/g, 'rounded-xl');
    content = content.replace(/rounded-2xl/g, 'rounded-xl');
    
    // specifically avoid replacing inside comments maybe? No it's fine for tailwind classes.
    // wait, what about the button regex? It was:
    // content = content.replace(/button[^>]*className="([^"]*)rounded-xl([^"]*)"/g, 'button className="$1rounded-lg$2"');
    // I will NOT run the button regex globally because it breaks block comments.

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
