const fs = require('fs');
const path = require('path');

const FLASHCARDS_DIR = path.join(__dirname, '..', 'public', 'flashcards', 'l2');
const INDEX_PATH = path.join(__dirname, '..', 'public', 'flashcards', 'l2_index.json');

const index = {};

if (fs.existsSync(FLASHCARDS_DIR)) {
    const units = fs.readdirSync(FLASHCARDS_DIR).filter(u => fs.statSync(path.join(FLASHCARDS_DIR, u)).isDirectory() && u !== 'misc');
    for (const unit of units) {
        const unitDir = path.join(FLASHCARDS_DIR, unit);
        const images = fs.readdirSync(unitDir).filter(img => img.match(/\.(png|jpe?g|gif)$/i));
        index[unit] = images.map(img => `/flashcards/l2/${unit}/${img}`);
    }
}

fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));
console.log("Đã tạo l2_index.json thành công!");
